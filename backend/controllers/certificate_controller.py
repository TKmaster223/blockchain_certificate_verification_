# controllers/certificate_controller.py
# Business logic layer - combines database + blockchain

import hashlib
from backend.services import db_service, blockchain_service

def issue_certificate(student_name, institution, degree, graduation_year):
    """
    Issue a new certificate:
    - Create a unique hash
    - Save to blockchain
    - Save metadata in MongoDB
    """
    cert_string = f"{student_name}{institution}{degree}{graduation_year}"
    cert_hash = hashlib.sha256(cert_string.encode()).hexdigest()

    # Store on blockchain
    blockchain_service.store_certificate_on_chain(cert_hash)

    # Save metadata in MongoDB
    cert_data = {
        "student_name": student_name,
        "institution": institution,
        "degree": degree,
        "graduation_year": graduation_year,
        "certificate_hash": cert_hash
    }
    db_service.save_certificate(cert_data)

    return cert_data


def verify_certificate(cert_hash):
    """
    Verify a certificate:
    - Check blockchain
    - Retrieve metadata from MongoDB
    """
    blockchain_valid = blockchain_service.verify_certificate_on_chain(cert_hash)
    cert_record = db_service.get_certificate_by_hash(cert_hash)

    if blockchain_valid and cert_record:
        return {"status": "Valid", "data": cert_record}
    else:
        return {"status": "Invalid", "data": None}
