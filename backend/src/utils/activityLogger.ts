import pool from '../config/database';

export const logActivity = async (
  userId: number | undefined,
  action: string,
  entityType: string,
  entityId: number,
  changes?: any,
  req?: any
) => {
  try {
    const ipAddress = req?.ip || req?.connection?.remoteAddress;
    const userAgent = req?.headers?.['user-agent'];

    await pool.query(
      `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, changes, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        userId,
        action,
        entityType,
        entityId,
        changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent
      ]
    );
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

export const ActivityActions = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  VIEW: 'view',
  DOWNLOAD: 'download',
  UPLOAD: 'upload',
  APPROVE: 'approve',
  REJECT: 'reject',
  ASSIGN: 'assign',
  COMPLETE: 'complete',
  COMMENT: 'comment',
};

export const EntityTypes = {
  SHOP_DRAWING: 'shop_drawing',
  RFI: 'rfi',
  MEETING: 'meeting',
  ENGINEER: 'engineer',
  TASK: 'task',
  COMMENT: 'comment',
};
