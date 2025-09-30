# 📜 Blockchain Certificate Verification System

> A decentralized certificate verification system that combines blockchain technology with traditional database storage to create tamper-proof digital certificates.

---

## 🎯 Project Overview

This system is perfect for educational institutions, certification bodies, or any organization that needs to issue verifiable credentials using blockchain technology.

### Key Benefits
- **🛡️ Tamper-Proof** - Blockchain ensures certificates cannot be forged
- **⚡ Fast Verification** - MongoDB enables quick certificate lookups  
- **🔐 Privacy-Preserving** - Only hashes stored on blockchain
- **📊 RESTful API** - Easy integration with applications
- **🐳 Containerized** - Easy deployment with Docker

---

## 🏗️ System Architecture

The system uses a **hybrid approach** with three main components:

### 1. 🔗 Blockchain Layer (Ethereum/Ganache)
- Stores certificate hashes for immutable verification
- Provides decentralized proof of existence  
- Uses smart contracts for certificate registry

### 2. 🗄️ Database Layer (MongoDB)
- Stores detailed certificate metadata
- Provides fast query capabilities
- Maintains privacy of sensitive information

### 3. 🌐 API Layer (FastAPI)
- RESTful API for certificate issuance and verification
- Interactive documentation at `/docs`
- JSON-based request/response format

---

## ⚙️ How It Works

### Certificate Issuance Process:
1. **Submit Data** → Certificate data (student, institution, degree, year) submitted
2. **Generate Hash** → System creates unique SHA-256 hash of certificate data
3. **Store on Blockchain** → Hash stored on blockchain for immutable proof
4. **Save Metadata** → Full certificate details stored in MongoDB
5. **Return ID** → Certificate hash returned for future verification

### Certificate Verification Process:
1. **Submit Query** → User submits certificate hash or search criteria
2. **Check Blockchain** → System verifies hash exists on blockchain
3. **Retrieve Details** → Full certificate information fetched from MongoDB
4. **Return Result** → Verification status and certificate data returned

---

## 🚀 Quick Start Guide

### Prerequisites
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] Basic understanding of REST APIs

### Setup Instructions

**Method 1: Using Docker Compose (Recommended)**
```bash
# 1. Navigate to project directory
cd cert-verification

# 2. Start all services
docker-compose up -d

# 3. Verify services are running
docker-compose ps

# 4. Access API documentation
# Open: http://localhost:8000/docs
```

**Method 2: Using Startup Scripts**
```bash
# Windows PowerShell
.\start.ps1

# Linux/Mac
./start.sh
```

**⚠️ Common Issue: Running uvicorn directly**
```bash
# ❌ DON'T run from root directory:
uvicorn main:app --reload

# ✅ DO run from backend directory:
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 🏆 BEST: Use Docker Compose (includes MongoDB & Blockchain)
docker-compose up -d
```

### Service Endpoints
| Service | URL | Purpose |
|---------|-----|---------|
| **API Backend** | `http://localhost:8000` | FastAPI application |
| **API Docs** | `http://localhost:8000/docs` | Interactive documentation |
| **MongoDB** | `http://localhost:27017` | Document database |
| **Blockchain** | `http://localhost:8545` | Ethereum simulator |

---

## 📡 API Reference

### Issue Certificate
**POST** `/issue`

```json
{
  "student_name": "John Doe",
  "institution": "University of Technology", 
  "degree": "Computer Science",
  "graduation_year": 2024
}
```

**Response:**
```json
{
  "message": "Certificate issued",
  "certificate": {
    "student_name": "John Doe",
    "institution": "University of Technology",
    "degree": "Computer Science", 
    "graduation_year": 2024,
    "hash": "a1b2c3d4e5f6..."
  }
}
```

### Verify Certificate
**POST** `/verify`

```json
{
  "student_name": "John Doe",
  "institution": "University of Technology"
}
```

**Response:**
```json
{
  "message": "Certificate verified successfully"
}
```

---

## 🔧 Technical Details

### File Structure
```
cert-verification/
├── 📄 docker-compose.yaml     # Service orchestration
├── 📁 backend/
│   ├── 🐍 main.py            # FastAPI entry point
│   ├── 🔧 utils.py           # Certificate utilities
│   ├── 📁 models/            # Data models
│   ├── 📁 controllers/       # Business logic
│   ├── 📁 services/          # DB & blockchain services
│   └── 📁 routes/            # API endpoints
└── 📁 blockchain/
    └── 📜 certificate_contract.sol  # Smart contract
```

### Core Components

**Certificate Model:**
```python
class Certificate(BaseModel):
    student_name: str
    institution: str  
    degree: str
    graduation_year: int
    certificate_hash: str
```

**Smart Contract:**
```solidity
contract CertRegistry {
    mapping(bytes32 => bool) public certHashes;
    
    function addCert(bytes32 _hash) public { ... }
    function verifyCert(bytes32 _hash) public view returns (bool) { ... }
}
```

---

## 🎯 Use Cases

### Educational Institutions
- Issue academic degrees and diplomas
- Verify student credentials
- Prevent certificate forgery

### Professional Certification  
- Training certificates and licenses
- Professional skill validation
- Industry standard compliance

### Employment Verification
- Confirm candidate credentials
- Background check automation  
- HR process streamlining

### Awards & Achievements
- Digital badges and certificates
- Competition results
- Professional recognitions

---

## 🚦 System Monitoring

### Health Checks
```bash
# API Status
curl http://localhost:8000/docs

# Blockchain Node  
curl http://localhost:8545

# Database Connection
mongo mongodb://localhost:27017
```

### Docker Commands
```bash
# Start services
docker-compose up -d

# Check status  
docker-compose ps

# View logs
docker-compose logs [service-name]

# Stop services
docker-compose down
```

---

## 💡 Example Workflow

1. **🏫 University Issues Diploma**
   - Certificate data submitted to API
   - Hash stored on blockchain
   - Metadata saved in database

2. **🎓 Student Receives Certificate ID**  
   - Gets unique certificate hash
   - Can share for verification purposes

3. **🏢 Employer Verifies Credentials**
   - Submits certificate hash to API
   - System checks blockchain + database
   - Returns verification result

4. **✅ Instant Verification**
   - Tamper-proof confirmation
   - Full certificate details provided
   - Trust established through blockchain

---

## 🔐 Security Features

- **Immutable Records** - Blockchain prevents tampering
- **Hash Verification** - SHA-256 cryptographic security  
- **Distributed Storage** - No single point of failure
- **Privacy Protection** - Sensitive data not on public blockchain
- **Access Control** - API-based permission management

---

## 🚀 Next Steps

### Potential Enhancements
- [ ] Web frontend interface
- [ ] Mobile application
- [ ] Batch certificate processing
- [ ] Advanced search capabilities  
- [ ] Multi-signature verification
- [ ] Integration with existing systems

### Deployment Options
- [ ] Cloud deployment (AWS, Azure, GCP)
- [ ] Kubernetes orchestration
- [ ] CI/CD pipeline setup
- [ ] Production blockchain integration
- [ ] Load balancing and scaling

---

*This system provides a production-ready foundation for secure, verifiable digital certificates with blockchain technology benefits while maintaining practical usability.*