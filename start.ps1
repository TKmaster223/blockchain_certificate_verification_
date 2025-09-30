# Certificate Verification System - Windows Startup Script

Write-Host "🚀 Starting Certificate Verification System with JWT Authentication..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Start all services
Write-Host "📦 Starting all services..." -ForegroundColor Yellow
docker-compose up -d

# Wait for services to be ready
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Check service status
Write-Host "🔍 Checking service status..." -ForegroundColor Yellow
docker-compose ps

# Setup initial admin user
Write-Host "👤 Setting up initial admin user..." -ForegroundColor Yellow
docker-compose exec backend python setup_admin.py

Write-Host ""
Write-Host "🧪 Available endpoints:" -ForegroundColor Cyan
Write-Host "🌐 API Documentation: http://localhost:8000/docs" -ForegroundColor White
Write-Host "🔐 Authentication required for most endpoints" -ForegroundColor White
Write-Host ""
Write-Host "📝 Default login credentials:" -ForegroundColor Cyan
Write-Host "   Admin: admin / admin123456" -ForegroundColor White
Write-Host "   Issuer: university_issuer / issuer123456" -ForegroundColor White
Write-Host ""
Write-Host "🔑 How to use:" -ForegroundColor Cyan
Write-Host "   1. Go to http://localhost:8000/docs" -ForegroundColor White
Write-Host "   2. Use POST /auth/login to get your JWT token" -ForegroundColor White
Write-Host "   3. Click 'Authorize' button and enter: Bearer <your-token>" -ForegroundColor White
Write-Host "   4. Now you can use all protected endpoints!" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Remember to change default passwords!" -ForegroundColor Red
Write-Host ""
Write-Host "✅ All services are ready!" -ForegroundColor Green