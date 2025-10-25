# Blockchain-Based Certificate Verification System

A secure, blockchain-powered certificate verification system with JWT authentication, built with FastAPI, MongoDB, and Ethereum smart contracts.

## 🚀 Features

- **JWT Authentication**: Secure user authentication with role-based access control
- **Certificate Issuance**: Issue certificates with cryptographic hashing
- **Blockchain Verification**: Store and verify certificate hashes on blockchain
- **MongoDB Storage**: Persistent certificate storage with integrity checks
- **RESTful API**: Full-featured API with interactive documentation
- **Docker Deployment**: Easy deployment with Docker Compose
- **Smart Contracts**: Ethereum-based certificate registry

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│    Frontend     │◄──►│   Backend API   │◄──►│   MongoDB       │
│   (Vue.js)      │    │   (FastAPI)     │    │   (Database)    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │                 │
                       │   Blockchain    │
                       │  (Ganache/ETH)  │
                       │                 │
                       └─────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **MongoDB**: NoSQL database for certificate storage
- **Web3.py**: Ethereum blockchain integration
- **JWT**: JSON Web Token authentication
- **Docker**: Containerization

### Frontend
- **Vue.js 3**: Progressive JavaScript framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool

### Blockchain
- **Solidity**: Smart contract language
- **Ganache**: Local Ethereum development blockchain
- **Web3**: Blockchain interaction library

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <https://github.com/TKmaster223/blockchain_certificate_verification_.git>
   cd cert-verification
   ```

2. **Start all services**
   ```bash
   # Windows
   .\start.ps1
   
   # Linux/Mac
   ./start.sh
   ```

3. **Access the application**
   - API Documentation: http://localhost:8000/docs
   - API Base URL: http://localhost:8000
   - Frontend: http://localhost:3000 (if running)

## 🔧 Manual Setup

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Default Credentials

**Admin User:**
- Username: `admin`
- Password: `admin123456`
- Email: `admin@certificate-system.com`

**Issuer User:**
- Username: `university_issuer`
- Password: `issuer123456`
- Email: `issuer@university.edu`

⚠️ **Change these passwords in production!**

## 📚 API Usage

### Authentication

1. **Login to get token**
   ```bash
   curl -X POST http://localhost:8000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username": "admin", "password": "admin123456"}'
   ```

2. **Use token in subsequent requests**
   ```bash
   curl -X GET http://localhost:8000/certificates \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

### Certificate Operations

1. **Issue a Certificate** (Issuer role required)
   ```bash
   curl -X POST http://localhost:8000/issue \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "student_name": "John Doe",
       "student_email": "john@example.com",
       "institution": "University of Technology",
       "degree": "B.Sc. Computer Science",
       "graduation_year": 2024,
       "cgpa": 4.5,
       "reg_number": "CSC/20/001",
       "honours": "First Class",
       "state_of_origin": "Lagos"
     }'
   ```

2. **Verify a Certificate**
   ```bash
   curl -X POST http://localhost:8000/verify \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"hash": "certificate_hash_here"}'
   ```

3. **List Certificates**
   ```bash
   curl -X GET http://localhost:8000/certificates \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

## 🏛️ Project Structure

```
cert-verification/
├── backend/                 # FastAPI backend application
│   ├── services/           # Business logic services
│   ├── models/             # Pydantic data models
│   ├── routes/             # API route handlers
│   ├── controllers/        # Request controllers
│   ├── main.py            # FastAPI application entry point
│   ├── auth.py            # Authentication logic
│   ├── config.py          # Configuration settings
│   └── utils.py           # Utility functions
├── frontend/               # Vue.js frontend application
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   └── package.json       # Node.js dependencies
├── blockchain/             # Smart contracts
│   └── certificate_contract.sol
├── docker-compose.yaml     # Docker services configuration
└── README.md              # Project documentation
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin, Issuer, and User roles
- **Hash Integrity**: SHA-256 certificate hashing
- **Blockchain Immutability**: Tamper-proof certificate storage
- **Input Validation**: Comprehensive data validation
- **CORS Protection**: Configurable cross-origin resource sharing

## 🧪 Testing

### Run Tests
```bash
# Backend tests
docker-compose exec backend python -m pytest

# Quick API test
curl http://localhost:8000/health
```

### Test Certificate Flow
1. Login as issuer
2. Issue a test certificate
3. Verify the certificate using its hash
4. Check certificate in database

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**
   - Change default passwords
   - Set secure JWT secret key
   - Configure production database URI
   - Set blockchain node endpoint

2. **Security**
   - Enable HTTPS
   - Configure proper CORS origins
   - Use production blockchain network
   - Implement rate limiting

3. **Infrastructure**
   - Use managed MongoDB service
   - Deploy on container orchestration platform
   - Set up monitoring and logging
   - Configure backup strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.

## 🔗 Links

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Vue.js Documentation](https://vuejs.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Web3.py Documentation](https://web3py.readthedocs.io/)
- [Solidity Documentation](https://docs.soliditylang.org/)

---

**Built with ❤️ using modern web technologies**
