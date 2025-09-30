# utils.py
import hashlib
import json
import os
from datetime import datetime
from typing import Any, Dict

from pymongo import MongoClient

# MongoDB connection - use environment variables when available
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "cert_verification")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
certificates = db["certificates"]

# Canonical fields included in the certificate hash.
# Order is preserved when serialising to ensure deterministic hashing across
# services. Update the frontend helper in `src/lib/certificates.ts` when
# changing this list.
HASH_FIELDS: tuple[str, ...] = (
    "student_name",
    "student_email",
    "institution",
    "degree",
    "graduation_year",
    "cgpa",
    "reg_number",
    "honours",
    "state_of_origin",
)


def _canonicalise_certificate_payload(metadata: Dict[str, Any]) -> Dict[str, Any]:
    """Return a canonical payload used for hashing.

    - Keeps only fields declared in ``HASH_FIELDS``
    - Strips whitespace from strings and removes empty values
    - Preserves numeric types
    """

    canonical: Dict[str, Any] = {}
    for field in HASH_FIELDS:
        if field not in metadata:
            continue
        value = metadata[field]
        if value is None:
            continue

        if isinstance(value, str):
            trimmed = value.strip()
            if not trimmed:
                continue
            canonical[field] = trimmed
        else:
            canonical[field] = value

    return canonical


def _serialise_for_hash(metadata: Dict[str, Any]) -> str:
    """Serialise metadata using sorted keys for deterministic hashing."""

    return json.dumps(metadata, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def generate_hash(certificate_metadata: Dict[str, Any]) -> str:
    payload = _canonicalise_certificate_payload(certificate_metadata)
    serialised = _serialise_for_hash(payload)
    return hashlib.sha256(serialised.encode()).hexdigest()

# Save certificate to DB
def save_certificate(metadata: dict) -> dict:
    """Persist certificate metadata and attach a deterministic hash."""

    issued_by = metadata.get("issued_by")
    issuer_email = metadata.get("issuer_email")

    canonical = _canonicalise_certificate_payload(metadata)
    created_at = datetime.utcnow()

    record: Dict[str, Any] = {
        **canonical,
        "issued_by": issued_by,
        "issuer_email": issuer_email,
        "created_at": created_at,
    }
    record["hash"] = generate_hash(record)

    result = certificates.insert_one(record.copy())
    record["_id"] = str(result.inserted_id)

    return record

# Verify certificate from DB
def verify_certificate(query: dict) -> bool:
    cert = certificates.find_one(query)
    if not cert:
        return False

    expected_hash = generate_hash(cert)

    return cert["hash"] == expected_hash

def get_certificate_by_hash(cert_hash: str) -> dict:
    """Get certificate by hash"""
    return certificates.find_one({"hash": cert_hash})

def get_certificates_by_issuer(issuer_username: str) -> list:
    """Get all certificates issued by a specific user"""
    return list(certificates.find({"issued_by": issuer_username}))
