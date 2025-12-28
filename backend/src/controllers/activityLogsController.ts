import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getByEntity = async (req: AuthRequest, res: Response) => {
  try {
    const { entityType, entityId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT a.*, u.username, u.full_name
       FROM activity_logs a
       LEFT JOIN users u ON a.user_id = u.id
       WHERE a.entity_type = $1 AND a.entity_id = $2
       ORDER BY a.created_at DESC
       LIMIT $3 OFFSET $4`,
      [entityType, entityId, limit, offset]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
};

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 100, offset = 0, entity_type } = req.query;
    
    let query = `
      SELECT a.*, u.username, u.full_name
      FROM activity_logs a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (entity_type) {
      query += ` AND a.entity_type = $${paramCount}`;
      params.push(entity_type);
      paramCount++;
    }

    query += ` ORDER BY a.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
};

export const logActivity = async (
  userId: number | undefined,
  action: string,
  entityType: string,
  entityId: number,
  changes?: any,
  ipAddress?: string,
  userAgent?: string
) => {
  try {
    await pool.query(
      `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, changes, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, action, entityType, entityId, changes ? JSON.stringify(changes) : null, ipAddress, userAgent]
    );
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};
