import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: number;
  isAlive?: boolean;
}

export class WebSocketService {
  private wss: WebSocketServer;
  private clients: Map<number, Set<AuthenticatedWebSocket>> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws: AuthenticatedWebSocket, req) => {
      console.log('New WebSocket connection attempt');

      const token = new URL(req.url || '', `http://${req.headers.host}`).searchParams.get('token');

      if (!token) {
        console.log('No token provided, closing connection');
        ws.close(1008, 'Token required');
        return;
      }

      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
        ) as any;

        ws.userId = decoded.id;
        ws.isAlive = true;

        if (!this.clients.has(decoded.id)) {
          this.clients.set(decoded.id, new Set());
        }
        this.clients.get(decoded.id)?.add(ws);

        console.log(`User ${decoded.id} connected via WebSocket`);

        ws.on('pong', () => {
          ws.isAlive = true;
        });

        ws.on('message', (message: string) => {
          try {
            const data = JSON.parse(message.toString());
            console.log('Received message:', data);
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        });

        ws.on('close', () => {
          console.log(`User ${decoded.id} disconnected`);
          if (ws.userId) {
            this.clients.get(ws.userId)?.delete(ws);
            if (this.clients.get(ws.userId)?.size === 0) {
              this.clients.delete(ws.userId);
            }
          }
        });

        ws.on('error', (error) => {
          console.error('WebSocket error:', error);
        });

        ws.send(JSON.stringify({
          type: 'connected',
          message: 'Successfully connected to WebSocket server'
        }));

      } catch (error) {
        console.log('Invalid token, closing connection');
        ws.close(1008, 'Invalid token');
      }
    });

    const interval = setInterval(() => {
      this.wss.clients.forEach((ws: AuthenticatedWebSocket) => {
        if (ws.isAlive === false) {
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);

    this.wss.on('close', () => {
      clearInterval(interval);
    });
  }

  public async sendNotification(userId: number, notification: any) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      const message = JSON.stringify({
        type: 'notification',
        data: notification
      });

      userClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }

    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, related_entity_type, related_entity_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        notification.type,
        notification.title,
        notification.message,
        notification.related_entity_type,
        notification.related_entity_id
      ]
    );
  }

  public broadcast(message: any) {
    const messageStr = JSON.stringify(message);
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }
}

let wsService: WebSocketService | null = null;

export const initializeWebSocket = (server: Server): WebSocketService => {
  wsService = new WebSocketService(server);
  return wsService;
};

export const getWebSocketService = (): WebSocketService => {
  if (!wsService) {
    throw new Error('WebSocket service not initialized');
  }
  return wsService;
};
