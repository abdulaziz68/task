# Task Linker - Full-Stack Application

A comprehensive full-stack application to organize and link all tasks related to Shop Drawings, RFIs, Meeting Minutes, and Outsourcing Engineers.

## 🏗️ Architecture

- **Backend**: Node.js + Express + TypeScript + PostgreSQL
- **Frontend Web**: React + TypeScript + Tailwind CSS
- **Frontend Mobile**: React Native + Expo
- **Real-time**: WebSockets for notifications
- **Infrastructure**: Docker + Docker Compose

## 📦 Project Structure

```
.
├── backend/                    # Node.js Backend
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # API controllers
│   │   ├── database/          # Migrations and seeds
│   │   ├── middleware/        # Authentication, upload, etc.
│   │   ├── routes/           # API routes
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utility functions
│   │   ├── websocket/        # WebSocket server
│   │   └── index.ts          # Main entry point
│   ├── Dockerfile
│   └── package.json
│
├── frontend-web/              # React Web Application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts (Auth, WebSocket)
│   │   ├── pages/            # Application pages
│   │   ├── services/         # API services
│   │   └── App.tsx           # Main app component
│   ├── Dockerfile
│   └── package.json
│
├── frontend-mobile/           # React Native Mobile App
│   ├── src/
│   │   └── screens/          # Mobile screens
│   ├── App.tsx
│   ├── app.json
│   └── package.json
│
└── docker-compose.yml         # Docker orchestration

```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 15+ (optional, for local development)

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   cd /home/engine/project
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Run database migrations**
   ```bash
   docker-compose exec backend npm run migrate
   ```

4. **Seed the database with default user**
   ```bash
   docker-compose exec backend npm run seed
   ```

5. **Access the applications**
   - Backend API: http://localhost:5000
   - Web Frontend: http://localhost:3000
   - WebSocket: ws://localhost:5000/ws

### Local Development

#### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm run seed
npm run dev
```

#### Web Frontend Setup

```bash
cd frontend-web
npm install
cp .env.example .env
npm start
```

#### Mobile App Setup

```bash
cd frontend-mobile
npm install
# Update API_URL in App.tsx to your backend URL
npm start
# Then press 'a' for Android or 'i' for iOS
```

## 🔐 Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

## 📊 Database Schema

### Main Tables

1. **users** - User accounts with JWT authentication
2. **shop_drawings** - Shop drawings with file uploads (الرسومات التنفيذية)
3. **rfis** - Requests for Information with attachments (الاستفسارات)
4. **rfi_attachments** - Multiple attachments per RFI
5. **meeting_minutes** - Meeting minutes and documents (محاضر الاجتماعات)
6. **meeting_attachments** - Multiple attachments per meeting
7. **engineers** - Outsourcing engineers information (المهندسين الخارجيين)
8. **tasks** - Task linking system (connects all entities)
9. **notifications** - Real-time notification system

### Relationships

- Tasks can link to Shop Drawings, RFIs, Meetings, and Engineers
- All entities support full CRUD operations
- File uploads for Shop Drawings, RFIs, and Meetings
- Real-time notifications via WebSockets

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Shop Drawings
- `GET /api/shop-drawings` - List all shop drawings
- `GET /api/shop-drawings/:id` - Get single shop drawing
- `POST /api/shop-drawings` - Create new shop drawing (with file)
- `PUT /api/shop-drawings/:id` - Update shop drawing
- `DELETE /api/shop-drawings/:id` - Delete shop drawing
- `GET /api/shop-drawings/:id/download` - Download file

### RFIs
- `GET /api/rfis` - List all RFIs
- `GET /api/rfis/:id` - Get single RFI
- `POST /api/rfis` - Create new RFI (with attachments)
- `PUT /api/rfis/:id` - Update RFI
- `DELETE /api/rfis/:id` - Delete RFI
- `POST /api/rfis/:id/attachments` - Add attachment
- `DELETE /api/rfis/attachments/:id` - Delete attachment
- `GET /api/rfis/attachments/:id/download` - Download attachment

### Meeting Minutes
- `GET /api/meeting-minutes` - List all meetings
- `GET /api/meeting-minutes/:id` - Get single meeting
- `POST /api/meeting-minutes` - Create new meeting (with attachments)
- `PUT /api/meeting-minutes/:id` - Update meeting
- `DELETE /api/meeting-minutes/:id` - Delete meeting
- `POST /api/meeting-minutes/:id/attachments` - Add attachment
- `DELETE /api/meeting-minutes/attachments/:id` - Delete attachment
- `GET /api/meeting-minutes/attachments/:id/download` - Download attachment

### Engineers
- `GET /api/engineers` - List all engineers
- `GET /api/engineers/:id` - Get single engineer
- `POST /api/engineers` - Create new engineer
- `PUT /api/engineers/:id` - Update engineer
- `DELETE /api/engineers/:id` - Delete engineer

### Tasks
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/:id` - Get single task
- `GET /api/tasks/:id/linked` - Get all linked items
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Notifications
- `GET /api/notifications` - List all notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🌐 WebSocket Events

Connect to WebSocket: `ws://localhost:5000/ws?token=YOUR_JWT_TOKEN`

### Events Received

```json
{
  "type": "notification",
  "data": {
    "type": "task_created",
    "title": "New Task Created",
    "message": "Task 'Review Shop Drawing' has been created",
    "related_entity_type": "task",
    "related_entity_id": 123
  }
}
```

## 🎨 Features

### Web Application
- ✅ User authentication with JWT
- ✅ Dashboard with statistics and charts
- ✅ Shop Drawings management with file upload
- ✅ RFIs management with multiple attachments
- ✅ Meeting Minutes with document management
- ✅ Engineers management
- ✅ Task linking across all modules
- ✅ Real-time notifications
- ✅ File upload/download
- ✅ Search and filter
- ✅ Responsive design

### Mobile Application
- ✅ Native iOS and Android support
- ✅ User authentication
- ✅ View all Shop Drawings
- ✅ View all RFIs
- ✅ View Meeting Minutes
- ✅ View Engineers
- ✅ View Tasks with linked items
- ✅ Pull to refresh
- ✅ Offline-ready structure

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/task_linker
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
```

### Frontend Web (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000
```

## 📱 Mobile App Configuration

Update the API URL in `frontend-mobile/App.tsx`:

```typescript
const API_URL = 'http://YOUR_IP_ADDRESS:5000/api';
```

For local testing, use your machine's IP address instead of `localhost`.

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up -d --build

# Run migrations
docker-compose exec backend npm run migrate

# Seed database
docker-compose exec backend npm run seed

# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d task_linker
```

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Web Frontend
cd frontend-web
npm test

# Mobile
cd frontend-mobile
npm test
```

## 📝 Development Guidelines

### Adding New Features

1. **Database Changes**
   - Update `backend/src/database/schema.sql`
   - Run migrations: `npm run migrate`

2. **Backend API**
   - Create controller in `backend/src/controllers/`
   - Create route in `backend/src/routes/`
   - Register route in `backend/src/index.ts`

3. **Frontend**
   - Add API service in `frontend-web/src/services/api.ts`
   - Create page component in `frontend-web/src/pages/`
   - Add route in `frontend-web/src/App.tsx`

4. **Mobile**
   - Create screen in `frontend-mobile/src/screens/`
   - Add navigation in `frontend-mobile/App.tsx`

## 🔒 Security Considerations

- JWT tokens expire after 7 days (configurable)
- All API endpoints (except login) require authentication
- File uploads are validated and size-limited (50MB)
- SQL injection protection via parameterized queries
- CORS enabled for specified origins
- Helmet.js for security headers

## 📈 Performance

- Database indexes on frequently queried fields
- Connection pooling for PostgreSQL
- Efficient file upload handling with multer
- WebSocket connection management

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

ISC

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps

# View PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Port Already in Use
```bash
# Change ports in docker-compose.yml
# Or stop conflicting services
```

### WebSocket Connection Fails
- Ensure token is valid and included in connection URL
- Check CORS settings
- Verify WebSocket URL format

## 📞 Support

For issues and questions, please refer to the project documentation or create an issue in the repository.

---

Built with ❤️ for efficient construction project management
