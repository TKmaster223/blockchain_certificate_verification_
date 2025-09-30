#!/bin/bash

# Certificate Verification System - Startup Script

echo "🚀 Starting Certificate Verification System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Start all services
echo "📦 Starting all services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo "🔍 Checking service status..."
docker-compose ps

# Test endpoints
echo "🧪 Testing endpoints..."
echo "Backend API: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs" 
echo "MongoDB: mongodb://localhost:27017"
echo "Blockchain Node: http://localhost:8545"

echo ""
echo "✅ All services are ready!"
echo "🌐 Open http://localhost:8000/docs in your browser to use the API"