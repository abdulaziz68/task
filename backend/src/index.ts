import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import fs from 'fs';

import { errorHandler } from './middleware/errorHandler';
import { initializeWebSocket } from './websocket/server';

import authRoutes from './routes/auth';
import shopDrawingsRoutes from './routes/shopDrawings';
import rfisRoutes from './routes/rfis';
import meetingMinutesRoutes from './routes/meetingMinutes';
import engineersRoutes from './routes/engineers';
import tasksRoutes from './routes/tasks';
import notificationsRoutes from './routes/notifications';
import dashboardRoutes from './routes/dashboard';
import commentsRoutes from './routes/comments';
import activityLogsRoutes from './routes/activityLogs';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(uploadDir));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/shop-drawings', shopDrawingsRoutes);
app.use('/api/rfis', rfisRoutes);
app.use('/api/meeting-minutes', meetingMinutesRoutes);
app.use('/api/engineers', engineersRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/activity-logs', activityLogsRoutes);

app.use(errorHandler);

initializeWebSocket(server);

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   Task Linker Backend Server          ║
║   Environment: ${process.env.NODE_ENV || 'development'}              ║
║   Port: ${PORT}                         ║
║   WebSocket: ws://localhost:${PORT}/ws    ║
╚═══════════════════════════════════════╝
  `);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
