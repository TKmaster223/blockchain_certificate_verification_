"""Configuration for database and blockchain connections."""

import os

# Database
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "cert_verification")

# Blockchain
BLOCKCHAIN_NODE = os.getenv("BLOCKCHAIN_NODE", "http://localhost:8545")
# Set to your deployed smart contract address (0x...) or leave empty to disable on-chain operations
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS", "")
