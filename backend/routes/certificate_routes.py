# routes/certificate_routes.py
# FastAPI routes for certificates

from fastapi import APIRouter
from backend.models.certificate import Certificate
from backend.controllers import certificate_controller

router = APIRouter()

@router.post("/issue")
def issue_certificate(cert: Certificate):
    """
    API to issue a new certificate.
    """
    return certificate_controller.issue_certificate(
        cert.student_name, cert.institution, cert.degree, cert.graduation_year
    )

@router.get("/verify/{cert_hash}")
def verify_certificate(cert_hash: str):
    """
    API to verify a certificate.
    """
    return certificate_controller.verify_certificate(cert_hash)
