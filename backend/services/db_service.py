# services/db_service.py
# Handles MongoDB operations for certificate storage

from pymongo import MongoClient
from backend.config import MONGO_URI, DB_NAME

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
cert_collection = db["certificates"]

def save_certificate(cert_data: dict):
    """
    Save certificate metadata in MongoDB
    """
    result = cert_collection.insert_one(cert_data)
    return str(result.inserted_id)

def get_certificate_by_hash(cert_hash: str):
    """
    Retrieve certificate by its blockchain hash
    """
    return cert_collection.find_one({"certificate_hash": cert_hash})
