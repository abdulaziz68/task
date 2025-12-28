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
            this.handleMessage(ws, data);
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
          message: 'Successfully connected to WebSocket server',
          timestamp: new Date().toISOString()
        }));

      } catch (error) {
        console.log('Invalid token, closing connection');
        ws.close(1008, 'Invalid token');
      }
    });

    // Heartbeat mechanism
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

  private handleMessage(ws: AuthenticatedWebSocket, data: any) {
    switch (data.type) {
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
        break;
      case 'subscribe':
        // Handle subscription to specific entities
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  public async sendNotification(userId: number, notification: any) {
    const userClients = this.clients.get(userId);
    
    // Save notification to database
    try {
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
    } catch (error) {
      console.error('Error saving notification to database:', error);
    }

    // Send via WebSocket if user is online
    if (userClients && userClients.size > 0) {
      const message = JSON.stringify({
        type: 'notification',
        data: {
          ...notification,
          timestamp: new Date().toISOString()
        }
      });

      userClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  }

  public broadcast(message: any) {
    const messageStr = JSON.stringify({
      ...message,
      timestamp: new Date().toISOString()
    });
    
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  public sendToUser(userId: number, message: any) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      const messageStr = JSON.stringify({
        ...message,
        timestamp: new Date().toISOString()
      });

      userClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageStr);
        }
      });
    }
  }

  public getOnlineUsers(): number[] {
    return Array.from(this.clients.keys());
  }

  public isUserOnline(userId: number): boolean {
    return this.clients.has(userId) && (this.clients.get(userId)?.size || 0) > 0;
  }
}

let wsService: WebSocketService | null = null;

export const initializeWebSocket = (server: Server): WebSocketService => {
  wsService = new WebSocketService(server);
  console.log('WebSocket server initialized');
  return wsService;
};

export const getWebSocketService = (): WebSocketService => {
  if (!wsService) {
    throw new Error('WebSocket service not initialized');
  }
  return wsService;
};
