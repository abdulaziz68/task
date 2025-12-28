# 📚 دليل المطور الشامل - Complete Developer Guide

## 📋 جدول المحتويات

1. [البدء السريع](#البدء-السريع)
2. [البنية المعمارية](#البنية-المعمارية)
3. [قاعدة البيانات](#قاعدة-البيانات)
4. [Backend API](#backend-api)
5. [Frontend Web](#frontend-web)
6. [Frontend Mobile](#frontend-mobile)
7. [WebSocket](#websocket)
8. [التطوير المحلي](#التطوير-المحلي)
9. [الاختبار](#الاختبار)
10. [النشر](#النشر)
11. [استكشاف الأخطاء](#استكشاف-الأخطاء)

---

## 🚀 البدء السريع

### المتطلبات الأساسية
```bash
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+ (اختياري للتطوير المحلي)
- Git
```

### التثبيت السريع
```bash
# 1. Clone repository
git clone <repo-url>
cd project

# 2. Start with Docker
./start.sh

# أو يدوياً:
docker-compose up -d
docker-compose exec backend npm run migrate
docker-compose exec backend npm run seed
```

---

## 🏗️ البنية المعمارية

### نظرة عامة
```
┌─────────────────┐
│  Frontend Web   │
│   (React)       │◄────────┐
└─────────────────┘         │
                            │ HTTP/WS
┌─────────────────┐         │
│ Frontend Mobile │         │
│ (React Native)  │◄────────┤
└─────────────────┘         │
                            ▼
                    ┌──────────────┐
                    │   Backend    │
                    │   (Node.js)  │
                    └──────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  PostgreSQL  │
                    └──────────────┘
```

### المكونات الرئيسية

#### 1. Backend (Node.js + Express + TypeScript)
- **API Server**: Express.js
- **Database**: PostgreSQL with pg driver
- **WebSocket**: ws library
- **Authentication**: JWT
- **File Upload**: Multer
- **Security**: Helmet, CORS, bcrypt

#### 2. Frontend Web (React + TypeScript)
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Context API
- **HTTP Client**: Axios
- **Real-time**: WebSocket

#### 3. Frontend Mobile (React Native + Expo)
- **Framework**: React Native 0.72
- **Platform**: Expo ~49.0.0
- **Navigation**: React Navigation v6
- **Storage**: AsyncStorage

---

## 💾 قاعدة البيانات

### Schema Overview

#### الجداول الرئيسية:
1. **users** - المستخدمون
2. **shop_drawings** - الرسومات التنفيذية
3. **rfis** - الاستفسارات
4. **meeting_minutes** - محاضر الاجتماعات
5. **engineers** - المهندسون الخارجيون
6. **tasks** - المهام الرابطة
7. **notifications** - الإشعارات
8. **comments** - التعليقات (جديد)
9. **activity_logs** - سجل النشاطات (جديد)
10. **user_preferences** - إعدادات المستخدم (جديد)

### Relationships
```sql
-- Tasks يربط جميع الكيانات
tasks.shop_drawing_id → shop_drawings.id
tasks.rfi_id → rfis.id
tasks.meeting_id → meeting_minutes.id
tasks.engineer_id → engineers.id

-- Comments لجميع الكيانات
comments.entity_type + entity_id → any entity

-- Activity Logs لجميع العمليات
activity_logs.entity_type + entity_id → any entity
```

### Migration Commands
```bash
# تشغيل migrations
docker-compose exec backend npm run migrate

# Seed البيانات
docker-compose exec backend npm run seed

# الوصول المباشر لقاعدة البيانات
docker-compose exec postgres psql -U postgres -d task_linker
```

### Useful Queries
```sql
-- عدد السجلات في كل جدول
SELECT 'users' as table_name, COUNT(*) FROM users
UNION ALL
SELECT 'shop_drawings', COUNT(*) FROM shop_drawings
UNION ALL
SELECT 'rfis', COUNT(*) FROM rfis;

-- النشاطات الأخيرة
SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 20;

-- التعليقات الأخيرة
SELECT * FROM comments ORDER BY created_at DESC LIMIT 20;

-- حذف جميع البيانات (للتطوير فقط!)
TRUNCATE TABLE activity_logs, comments, notifications, 
  tasks, meeting_attachments, meeting_minutes, 
  rfi_attachments, rfis, shop_drawings, engineers CASCADE;
```

---

## 🔧 Backend API

### Structure
```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── database/        # Migrations & seeds
│   ├── middleware/      # Auth, upload, etc
│   ├── routes/          # API routes
│   ├── types/           # TypeScript types
│   ├── utils/           # Helper functions
│   ├── websocket/       # WebSocket server
│   └── index.ts         # Main entry point
```

### إضافة Endpoint جديد

#### 1. أنشئ Controller:
```typescript
// src/controllers/myController.ts
import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM my_table');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
};
```

#### 2. أنشئ Route:
```typescript
// src/routes/myRoute.ts
import { Router } from 'express';
import * as myController from '../controllers/myController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
router.use(authenticateToken);
router.get('/', myController.getAll);

export default router;
```

#### 3. سجّل في index.ts:
```typescript
import myRoutes from './routes/myRoute';
app.use('/api/my-endpoint', myRoutes);
```

### Authentication Flow
```typescript
// 1. Login
POST /api/auth/login
Body: { username, password }
Response: { token, user }

// 2. Use Token
Headers: { Authorization: 'Bearer <token>' }

// 3. Verify
Middleware: authenticateToken
Sets req.user with decoded token
```

### File Upload Example
```typescript
import { upload } from '../middleware/upload';

router.post('/', 
  upload.single('file'), 
  controller.create
);

// In controller:
const file = req.file;
// file.path, file.originalname, file.size
```

---

## 🎨 Frontend Web

### Structure
```
frontend-web/
├── src/
│   ├── components/
│   │   └── common/         # Reusable components
│   ├── contexts/           # React contexts
│   ├── pages/              # Page components
│   ├── services/           # API services
│   └── App.tsx
```

### إضافة صفحة جديدة

#### 1. أنشئ الصفحة:
```typescript
// src/pages/MyPage.tsx
import React from 'react';

const MyPage: React.FC = () => {
  return (
    <div>
      <h1>My New Page</h1>
    </div>
  );
};

export default MyPage;
```

#### 2. أضف Route:
```typescript
// src/App.tsx
import MyPage from './pages/MyPage';

<Route path="/my-page" element={
  <PrivateRoute>
    <Layout>
      <MyPage />
    </Layout>
  </PrivateRoute>
} />
```

#### 3. أضف في Navigation:
```typescript
// src/components/common/Layout.tsx
const navItems = [
  // ... existing items
  { path: '/my-page', label: 'My Page', icon: '📄' },
];
```

### استخدام API
```typescript
import { shopDrawingsAPI } from '../services/api';

const loadData = async () => {
  try {
    const response = await shopDrawingsAPI.getAll();
    setData(response.data);
  } catch (error) {
    console.error(error);
  }
};
```

### استخدام Contexts
```typescript
// Auth
import { useAuth } from '../contexts/AuthContext';
const { user, isAuthenticated, login, logout } = useAuth();

// Toast
import { useToast } from '../contexts/ToastContext';
const { success, error } = useToast();

// WebSocket
import { useWebSocket } from '../contexts/WebSocketContext';
const { isConnected, lastMessage } = useWebSocket();
```

### Styling مع Tailwind
```typescript
<div className="bg-white rounded-lg shadow p-6">
  <h2 className="text-2xl font-bold mb-4">Title</h2>
  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
    Click Me
  </button>
</div>
```

---

## 📱 Frontend Mobile

### Structure
```
frontend-mobile/
├── src/
│   └── screens/        # App screens
├── App.tsx             # Main app
└── app.json            # Expo config
```

### تشغيل Mobile App
```bash
cd frontend-mobile
npm install

# Start Expo
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### إضافة Screen جديد
```typescript
// src/screens/MyScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';

const MyScreen = () => {
  return (
    <View>
      <Text>My Screen</Text>
    </View>
  );
};

export default MyScreen;
```

### تحديث Navigation
```typescript
// App.tsx
import MyScreen from './src/screens/MyScreen';

<Tab.Screen name="MyScreen" component={MyScreen} />
```

---

## 🔌 WebSocket

### Backend Setup
```typescript
// Already configured in src/websocket/server.ts
const wsService = getWebSocketService();

// Send notification
await wsService.sendNotification(userId, {
  type: 'task_created',
  title: 'New Task',
  message: 'A new task has been created',
});

// Broadcast to all
wsService.broadcast({
  type: 'announcement',
  message: 'System maintenance in 10 minutes'
});
```

### Frontend Connection
```typescript
// Already configured in WebSocketContext
const { isConnected, lastMessage } = useWebSocket();

useEffect(() => {
  if (lastMessage?.type === 'notification') {
    showToast(lastMessage.data.message, 'info');
  }
}, [lastMessage]);
```

---

## 💻 التطوير المحلي

### Backend Development
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npm run dev

# In another terminal
npm run migrate
npm run seed
```

### Frontend Development
```bash
cd frontend-web
npm install
cp .env.example .env
npm start
```

### Database Management
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d task_linker

# View logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Restart service
docker-compose restart backend
```

### Hot Reload
- ✅ Backend: Enabled with ts-node-dev
- ✅ Frontend: Enabled with React Scripts
- ✅ Changes reflect automatically

---

## 🧪 الاختبار

### Manual Testing Checklist

#### Backend:
```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Protected endpoint
curl http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer <token>"
```

#### Frontend:
1. ✅ Login page works
2. ✅ Dashboard loads data
3. ✅ CRUD operations work
4. ✅ File upload/download works
5. ✅ WebSocket connects
6. ✅ Comments system works
7. ✅ Activity logs display
8. ✅ Toast notifications appear
9. ✅ Pagination works
10. ✅ Logout works

---

## 🚀 النشر

### Production Checklist

#### Environment Variables:
```bash
# Backend
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
DATABASE_URL=<production-db-url>

# Frontend
REACT_APP_API_URL=<production-api-url>
REACT_APP_WS_URL=<production-ws-url>
```

#### Security:
- ✅ تغيير JWT_SECRET
- ✅ تفعيل HTTPS
- ✅ إعداد CORS بشكل صحيح
- ✅ تحديد rate limiting
- ✅ إعداد firewall
- ✅ backup للقاعدة البيانات

#### Performance:
- ✅ تفعيل compression
- ✅ استخدام CDN للملفات
- ✅ Database indexing
- ✅ Connection pooling
- ✅ Caching strategy

### Docker Production
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      NODE_ENV: production
    # ... other settings
```

---

## 🔍 استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. Database Connection Failed
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View logs
docker-compose logs postgres

# Restart
docker-compose restart postgres
```

#### 2. Backend Not Starting
```bash
# Check logs
docker-compose logs backend

# Common issues:
# - Port 5000 already in use
# - Missing dependencies
# - Database not ready

# Solutions:
docker-compose down
docker-compose up -d
docker-compose exec backend npm install
```

#### 3. Frontend Can't Reach Backend
```bash
# Check .env file
cat frontend-web/.env

# Should have:
REACT_APP_API_URL=http://localhost:5000

# Check backend is running
curl http://localhost:5000/health
```

#### 4. WebSocket Not Connecting
```bash
# Check token is valid
# Check WebSocket URL format
# ws://localhost:5000/ws?token=<your-token>

# View WebSocket logs
docker-compose logs backend | grep WebSocket
```

#### 5. File Upload Fails
```bash
# Check uploads directory exists
docker-compose exec backend ls -la /app/uploads

# Check permissions
docker-compose exec backend chmod 777 /app/uploads

# Check file size limit (50MB default)
```

---

## 📊 Monitoring & Logging

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Database Stats
```sql
-- Active connections
SELECT count(*) FROM pg_stat_activity;

-- Table sizes
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(tablename::text)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::text) DESC;

-- Slow queries (if enabled)
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

---

## 🎓 Best Practices

### Code Style
- ✅ استخدم TypeScript types
- ✅ تعليقات واضحة بالعربية والإنجليزية
- ✅ Error handling شامل
- ✅ Logging مناسب
- ✅ Component reusability

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push
git push origin feature/new-feature

# Create Pull Request
```

### Database
- ✅ استخدم parameterized queries
- ✅ Indexes للأداء
- ✅ Cascade deletes محسّنة
- ✅ Regular backups

---

## 📞 الدعم والمساعدة

### Resources
- 📚 [README_TASKLINKER.md](README_TASKLINKER.md)
- 🚀 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- ⚡ [QUICK_START.md](QUICK_START.md)
- ✨ [FEATURES_ADDED.md](FEATURES_ADDED.md)
- 📊 [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

### Community
- GitHub Issues
- Stack Overflow
- Discord Server (إذا متوفر)

---

**آخر تحديث**: ديسمبر 2024
**الإصدار**: 2.0.0
**الحالة**: ✅ جاهز للإنتاج
