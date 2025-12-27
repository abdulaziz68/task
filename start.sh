#!/bin/bash

echo "╔═══════════════════════════════════════╗"
echo "║   Task Linker - Deployment Script    ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✓ Docker and Docker Compose are installed"
echo ""

# Stop any running containers
echo "Stopping existing containers..."
docker-compose down

# Start services
echo "Starting services..."
docker-compose up -d

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Run migrations
echo "Running database migrations..."
docker-compose exec -T backend npm run migrate

# Seed database
echo "Seeding database with default user..."
docker-compose exec -T backend npm run seed

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║   ✅ Deployment Complete!             ║"
echo "╚═══════════════════════════════════════╝"
echo ""
echo "Services are now running:"
echo "  🔧 Backend API:    http://localhost:5000"
echo "  🌐 Web Frontend:   http://localhost:3000"
echo "  🔌 WebSocket:      ws://localhost:5000/ws"
echo "  🗄️  PostgreSQL:     localhost:5432"
echo ""
echo "Default credentials:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
echo ""
