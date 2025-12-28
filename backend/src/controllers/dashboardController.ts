import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const shopDrawingsCount = await pool.query('SELECT COUNT(*) FROM shop_drawings');
    const rfisCount = await pool.query('SELECT COUNT(*) FROM rfis');
    const meetingsCount = await pool.query('SELECT COUNT(*) FROM meeting_minutes');
    const engineersCount = await pool.query('SELECT COUNT(*) FROM engineers');
    const tasksCount = await pool.query('SELECT COUNT(*) FROM tasks');
    
    const shopDrawingsByStatus = await pool.query(
      'SELECT status, COUNT(*) as count FROM shop_drawings GROUP BY status'
    );
    
    const rfisByStatus = await pool.query(
      'SELECT status, COUNT(*) as count FROM rfis GROUP BY status'
    );
    
    const tasksByStatus = await pool.query(
      'SELECT status, COUNT(*) as count FROM tasks GROUP BY status'
    );
    
    const tasksByPriority = await pool.query(
      'SELECT priority, COUNT(*) as count FROM tasks GROUP BY priority'
    );
    
    const recentTasks = await pool.query(
      'SELECT * FROM tasks ORDER BY created_at DESC LIMIT 5'
    );
    
    const recentRfis = await pool.query(
      'SELECT * FROM rfis ORDER BY created_at DESC LIMIT 5'
    );

    res.json({
      totals: {
        shopDrawings: parseInt(shopDrawingsCount.rows[0].count),
        rfis: parseInt(rfisCount.rows[0].count),
        meetings: parseInt(meetingsCount.rows[0].count),
        engineers: parseInt(engineersCount.rows[0].count),
        tasks: parseInt(tasksCount.rows[0].count)
      },
      shopDrawingsByStatus: shopDrawingsByStatus.rows,
      rfisByStatus: rfisByStatus.rows,
      tasksByStatus: tasksByStatus.rows,
      tasksByPriority: tasksByPriority.rows,
      recentTasks: recentTasks.rows,
      recentRfis: recentRfis.rows
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
