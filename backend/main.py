# main.py
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from routes.auth_routes import router as auth_router
from models.certificate import CertificateIssueRequest, IssueResponse, CertificateRecord
from models.user import UserResponse
from auth import get_current_active_user, issuer_required
from utils import save_certificate, verify_certificate, generate_hash
from services.blockchain_service import (
    store_certificate_on_chain,
    verify_certificate_on_chain,
    get_blockchain_status,
)
import os
from pydantic import BaseModel, Field, ConfigDict, field_validator

# Initialize FastAPI app
app = FastAPI(
    title="Certificate Verification System",
    description="A blockchain-based certificate verification system with JWT authentication",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security scheme
security = HTTPBearer()

# Include authentication routes
app.include_router(auth_router)

@app.get("/")
async def root():
    """Welcome endpoint"""
    return {
        "message": "Certificate Verification System API",
        "version": "2.0.0",
        "docs": "/docs",
        "authentication": "JWT Bearer Token Required"
    }

@app.post("/issue", status_code=status.HTTP_201_CREATED, response_model=IssueResponse, tags=["Certificates"], summary="Issue a new certificate")
async def issue_certificate(
    metadata: CertificateIssueRequest,
    current_user: dict = Depends(issuer_required)
):
    """
    Issue a new certificate (requires issuer role or admin)
    """
    try:
        # Add issuer information to certificate metadata
        payload = metadata.model_dump()
        payload["issued_by"] = current_user["username"]
        payload["issuer_email"] = current_user["email"]

        # Compute deterministic hash first (based on payload fields)
        predicted_hash = generate_hash(payload)

        # Store hash on blockchain first (best-effort with clear status)
        try:
            bc_ok = store_certificate_on_chain(predicted_hash)
        except Exception:
            bc_ok = False

        # Then persist to DB (regardless of chain result to keep audit trail)
        cert = save_certificate(payload)
        return IssueResponse(
            message="Certificate issued successfully",
            certificate=CertificateRecord(**cert),
            issued_by=current_user["username"],
            blockchain_stored=bool(bc_ok),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error issuing certificate: {str(e)}"
        )

class VerifyRequest(BaseModel):
    """Strict verification payload: only the certificate hash is allowed."""
    model_config = ConfigDict(extra="forbid")
    hash: str = Field(..., description="Hex certificate hash (64 chars, with or without 0x prefix)")

    @field_validator("hash")
    @classmethod
    def validate_hash(cls, v: str) -> str:
        if not isinstance(v, str):
            raise ValueError("hash must be a string")
        h = v.strip().lower()
        if h.startswith("0x"):
            h = h[2:]
        if len(h) != 64:
            raise ValueError("hash must be 64 hex characters")
        if any(c not in "0123456789abcdef" for c in h):
            raise ValueError("hash must be a valid hex string")
        return v.strip()


@app.post("/verify")
async def verify_certificate_endpoint(
    payload: VerifyRequest,
    current_user: dict = Depends(get_current_active_user),
):
    """Verify a certificate by its hash (requires authentication)."""

    # Normalise hash (allow optional 0x prefix)
    cert_hash = payload.hash.strip()
    if cert_hash.lower().startswith("0x"):
        cert_hash = cert_hash[2:]
    # Normalise to lowercase since stored sha256 hexdigest is lowercase
    cert_hash = cert_hash.lower()

    try:
        # Database presence and integrity check
        from utils import certificates, generate_hash
        doc = certificates.find_one({"hash": cert_hash})
        exists_in_db = bool(doc)
        integrity_ok = False
        if doc:
            try:
                integrity_ok = (generate_hash(doc) == doc.get("hash"))
            except Exception:
                integrity_ok = False

        # Blockchain check
        try:
            chain_valid = verify_certificate_on_chain(cert_hash)
        except Exception:
            chain_valid = False

        if exists_in_db and integrity_ok and chain_valid:
            return {
                "message": "Certificate verified successfully (DB and blockchain)",
                "verified_by": current_user["username"],
                "status": "valid",
            }
        else:
            reason = []
            if not exists_in_db:
                reason.append("not found in database")
            elif not integrity_ok:
                reason.append("hash mismatch for stored record")
            if not chain_valid:
                reason.append("not found on blockchain")
            return {
                "message": f"Certificate verification failed: {', '.join(reason)}; {{'hash': '{cert_hash}'}}",
                "verified_by": current_user["username"],
                "status": "invalid",
            }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error verifying certificate: {str(e)}",
        )

@app.get("/certificates", dependencies=[Depends(get_current_active_user)])
async def list_certificates(current_user: dict = Depends(get_current_active_user)):
    """
    List certificates (authenticated users only)
    """
    try:
        from utils import certificates
        
        # If user is admin or issuer, show all certificates
        # If regular user, show certificates they can access
        if current_user["role"] in ["admin", "issuer"]:
            certs = list(certificates.find({}, {"_id": 0}))
        else:
            # Regular users can see certificates but with limited info
            certs = list(certificates.find({}, {"_id": 0, "hash": 1, "student_name": 1, "institution": 1, "degree": 1, "graduation_year": 1}))
        
        return {
            "certificates": certs,
            "count": len(certs),
            "accessed_by": current_user["username"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching certificates: {str(e)}"
        )

@app.get("/health")
async def health_check():
    """Public health check endpoint"""
    base = {
        "status": "healthy",
        "service": "Certificate Verification API",
        "version": "2.0.0"
    }

    # Include basic blockchain readiness information for visibility
    try:
        bc = get_blockchain_status()
        base["blockchain"] = bc
    except Exception:
        base["blockchain"] = {"connected": False, "contract_ready": False}
    return base