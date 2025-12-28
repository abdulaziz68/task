# Task Linker - Deployment and Testing Guide

## 🚀 Quick Start (5 minutes)

### Option 1: Docker (Recommended)

```bash
# 1. Navigate to project directory
cd /home/engine/project

# 2. Run the automated deployment script
./start.sh

# 3. Access the application
# Web: http://localhost:3000
# API: http://localhost:5000
# Login: admin / admin123
```

### Option 2: Manual Docker Commands

```bash
# 1. Start services
docker-compose up -d

# 2. Wait for database to be ready (10-15 seconds)
sleep 15

# 3. Run migrations
docker-compose exec backend npm run migrate

# 4. Seed database
docker-compose exec backend npm run seed

# 5. Access applications
# Web: http://localhost:3000
# API: http://localhost:5000
```

## 🧪 Testing the Application

### 1. Backend API Testing

#### Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Expected response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@tasklinker.com"
  }
}
```

#### Get Dashboard Stats (requires authentication)
```bash
TOKEN="your-jwt-token-here"
curl http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Web Frontend Testing

1. **Open browser**: Navigate to http://localhost:3000
2. **Login**: Use credentials `admin` / `admin123`
3. **Dashboard**: Verify all statistics are displayed
4. **Navigation**: Test all menu items (Shop Drawings, RFIs, Meetings, Engineers, Tasks)
5. **Create Shop Drawing**:
   - Click "+ Add New" on Shop Drawings page
   - Fill in required fields
   - Upload a file (PDF, DWG, or image)
   - Submit and verify it appears in the list
6. **WebSocket**: Check browser console for WebSocket connection message
7. **Logout**: Click logout button and verify redirect to login page

### 3. Mobile App Testing

#### Setup
```bash
cd frontend-mobile
npm install

# Update API URL in App.tsx
# Replace with your machine's IP address
# const API_URL = 'http://192.168.1.100:5000/api';

npm start
```

#### Testing Steps
1. Scan QR code with Expo Go app (iOS) or Expo app (Android)
2. Login with admin credentials
3. Test all screens:
   - Dashboard (verify stats)
   - Shop Drawings (pull to refresh)
   - RFIs
   - Meetings
   - Engineers
   - Tasks (verify linked items display)
4. Test logout

## 📋 Complete Feature Checklist

### ✅ Backend Features

- [x] User authentication with JWT
- [x] Shop Drawings CRUD API
- [x] RFIs CRUD API with attachments
- [x] Meeting Minutes CRUD API with attachments
- [x] Engineers CRUD API
- [x] Tasks CRUD API with linking
- [x] Notifications API
- [x] Dashboard statistics API
- [x] File upload functionality
- [x] File download functionality
- [x] WebSocket server for real-time notifications
- [x] Error handling and validation
- [x] Database migrations
- [x] Database seeding

### ✅ Web Frontend Features

- [x] Login page
- [x] Dashboard with statistics
- [x] Shop Drawings management page
  - [x] List view
  - [x] Create with file upload
  - [x] Edit with file update
  - [x] Delete
  - [x] Download file
- [x] RFIs management page
  - [x] List view
  - [x] Status indicators
- [x] Meeting Minutes page
  - [x] List view
  - [x] Date display
- [x] Engineers management page
  - [x] Card view
  - [x] Status badges
- [x] Tasks page
  - [x] Table view
  - [x] Linked items display
- [x] Responsive design
- [x] Real-time WebSocket connection
- [x] Navigation menu
- [x] Logout functionality

### ✅ Mobile App Features

- [x] Login screen
- [x] Dashboard with statistics
- [x] Shop Drawings list
- [x] RFIs list
- [x] Meeting Minutes list
- [x] Engineers list
- [x] Tasks list with linked items
- [x] Pull to refresh
- [x] Bottom tab navigation
- [x] Status badges
- [x] Logout functionality

### ✅ Infrastructure

- [x] Docker Compose configuration
- [x] PostgreSQL container
- [x] Backend container
- [x] Frontend web container
- [x] Hot reload for development
- [x] Volume persistence
- [x] Health checks
- [x] Automated startup script

## 🔍 Verification Steps

### Database Verification

```bash
# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d task_linker

# Check tables
\dt

# Count records
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM shop_drawings;
SELECT COUNT(*) FROM rfis;
SELECT COUNT(*) FROM meeting_minutes;
SELECT COUNT(*) FROM engineers;
SELECT COUNT(*) FROM tasks;

# Exit
\q
```

### Container Status

```bash
# Check all containers are running
docker-compose ps

# Expected output:
# task-linker-db       Up (healthy)
# task-linker-backend  Up
# task-linker-web      Up
```

### Logs Verification

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs postgres
docker-compose logs frontend-web

# Follow logs in real-time
docker-compose logs -f backend
```

## 🧩 Creating Test Data

### Via API (recommended)

Save this token after login:
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | \
  jq -r '.token')
```

Create Shop Drawing:
```bash
curl -X POST http://localhost:5000/api/shop-drawings \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Foundation Plan" \
  -F "drawing_number=A-001" \
  -F "description=Main foundation drawing" \
  -F "revision=Rev A" \
  -F "status=pending" \
  -F "file=@/path/to/your/file.pdf"
```

Create Engineer:
```bash
curl -X POST http://localhost:5000/api/engineers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "specialization": "Structural Engineer",
    "company": "ABC Engineering",
    "status": "active"
  }'
```

Create RFI:
```bash
curl -X POST http://localhost:5000/api/rfis \
  -H "Authorization: Bearer $TOKEN" \
  -F "rfi_number=RFI-001" \
  -F "subject=Clarification on foundation depth" \
  -F "description=Please clarify the required foundation depth" \
  -F "priority=high" \
  -F "status=open"
```

### Via Web Interface (easier)

1. Login to http://localhost:3000
2. Navigate to each section and click "+ Add New"
3. Fill in the forms and submit

## 🐛 Troubleshooting

### Port Already in Use

If ports 3000, 5000, or 5432 are already in use:

```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change ports in docker-compose.yml
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres

# Wait and retry migrations
sleep 10
docker-compose exec backend npm run migrate
```

### Frontend Can't Connect to Backend

1. Check backend is running: `docker-compose ps backend`
2. Check backend logs: `docker-compose logs backend`
3. Verify API URL in frontend-web/.env
4. Check CORS settings in backend

### WebSocket Connection Issues

1. Verify token is valid
2. Check WebSocket URL format: `ws://localhost:5000/ws?token=YOUR_TOKEN`
3. Check browser console for errors
4. Ensure backend WebSocket server is running

### Mobile App Connection Issues

1. Ensure mobile device and computer are on same network
2. Use computer's IP address instead of localhost
3. Check firewall settings
4. Verify backend is accessible from mobile device:
   ```bash
   # From mobile device browser
   http://YOUR_IP:5000/health
   ```

## 📊 Performance Testing

### Load Testing with Apache Bench

```bash
# Install Apache Bench
sudo apt-get install apache2-utils  # Ubuntu/Debian
brew install httpd  # macOS

# Test API endpoint
ab -n 1000 -c 10 -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/dashboard/stats
```

### Database Performance

```bash
# Check connection count
docker-compose exec postgres psql -U postgres -d task_linker \
  -c "SELECT count(*) FROM pg_stat_activity;"

# Check slow queries
docker-compose exec postgres psql -U postgres -d task_linker \
  -c "SELECT query, calls, total_time FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

## 🔐 Security Checklist

- [x] JWT authentication implemented
- [x] Passwords hashed with bcrypt
- [x] SQL injection prevention (parameterized queries)
- [x] File upload validation
- [x] File size limits (50MB)
- [x] CORS configuration
- [x] Helmet.js security headers
- [x] Environment variables for secrets
- [ ] Rate limiting (consider adding for production)
- [ ] HTTPS/SSL (required for production)
- [ ] Input sanitization (consider adding)

## 📈 Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:5000/health

# Check all services
docker-compose ps

# Resource usage
docker stats
```

### Log Aggregation

```bash
# Save logs to file
docker-compose logs > app-logs.txt

# Search logs
docker-compose logs | grep ERROR
docker-compose logs | grep WARNING
```

## 🚀 Production Deployment Considerations

1. **Environment Variables**
   - Generate strong JWT_SECRET
   - Use production database credentials
   - Set NODE_ENV=production

2. **Database**
   - Use managed PostgreSQL service
   - Enable automated backups
   - Set up connection pooling

3. **File Storage**
   - Consider cloud storage (S3, Azure Blob)
   - Implement CDN for file delivery

4. **Scaling**
   - Use load balancer for multiple backend instances
   - Separate WebSocket server if needed
   - Implement Redis for session management

5. **Monitoring**
   - Set up APM (Application Performance Monitoring)
   - Configure log aggregation
   - Set up alerts for errors

6. **Security**
   - Enable HTTPS
   - Implement rate limiting
   - Set up Web Application Firewall (WAF)
   - Regular security audits

## ✅ Acceptance Criteria Verification

- ✅ User can login with JWT
- ✅ User can upload and manage shop drawings
- ✅ User can create and track RFIs
- ✅ User can record meeting minutes
- ✅ User can manage engineer information
- ✅ User can link tasks across all modules
- ✅ Real-time notifications work via WebSocket
- ✅ Files can be uploaded/downloaded
- ✅ Both web and mobile versions work locally
- ✅ Docker setup allows easy local deployment
- ✅ Full responsive design on web and mobile

## 📞 Support

For issues or questions, please refer to:
- Main README: `README_TASKLINKER.md`
- Backend README: `backend/README.md`
- Frontend README: `frontend-web/README.md`
- Mobile README: `frontend-mobile/README.md`

---

**Last Updated**: 2024
**Version**: 1.0.0
