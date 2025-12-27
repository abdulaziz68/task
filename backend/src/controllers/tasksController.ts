import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const { status, priority, search } = req.query;
    let query = `
      SELECT t.*, 
             sd.title as shop_drawing_title,
             r.subject as rfi_subject,
             mm.title as meeting_title,
             e.name as engineer_name
      FROM tasks t
      LEFT JOIN shop_drawings sd ON t.shop_drawing_id = sd.id
      LEFT JOIN rfis r ON t.rfi_id = r.id
      LEFT JOIN meeting_minutes mm ON t.meeting_id = mm.id
      LEFT JOIN engineers e ON t.engineer_id = e.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      query += ` AND t.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (priority) {
      query += ` AND t.priority = $${paramCount}`;
      params.push(priority);
      paramCount++;
    }

    if (search) {
      query += ` AND (t.title ILIKE $${paramCount} OR t.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ' ORDER BY t.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT t.*, 
             sd.title as shop_drawing_title, sd.drawing_number,
             r.subject as rfi_subject, r.rfi_number,
             mm.title as meeting_title, mm.meeting_number,
             e.name as engineer_name, e.email as engineer_email
      FROM tasks t
      LEFT JOIN shop_drawings sd ON t.shop_drawing_id = sd.id
      LEFT JOIN rfis r ON t.rfi_id = r.id
      LEFT JOIN meeting_minutes mm ON t.meeting_id = mm.id
      LEFT JOIN engineers e ON t.engineer_id = e.id
      WHERE t.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      due_date,
      assigned_to,
      shop_drawing_id,
      rfi_id,
      meeting_id,
      engineer_id
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, priority, due_date, assigned_to,
       shop_drawing_id, rfi_id, meeting_id, engineer_id, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        title,
        description,
        status || 'pending',
        priority || 'medium',
        due_date,
        assigned_to,
        shop_drawing_id,
        rfi_id,
        meeting_id,
        engineer_id,
        req.user?.id
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status,
      priority,
      due_date,
      assigned_to,
      shop_drawing_id,
      rfi_id,
      meeting_id,
      engineer_id
    } = req.body;

    const existingResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const existing = existingResult.rows[0];

    const result = await pool.query(
      `UPDATE tasks
       SET title = $1, description = $2, status = $3, priority = $4, due_date = $5,
           assigned_to = $6, shop_drawing_id = $7, rfi_id = $8, meeting_id = $9,
           engineer_id = $10, updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [
        title || existing.title,
        description !== undefined ? description : existing.description,
        status || existing.status,
        priority || existing.priority,
        due_date !== undefined ? due_date : existing.due_date,
        assigned_to !== undefined ? assigned_to : existing.assigned_to,
        shop_drawing_id !== undefined ? shop_drawing_id : existing.shop_drawing_id,
        rfi_id !== undefined ? rfi_id : existing.rfi_id,
        meeting_id !== undefined ? meeting_id : existing.meeting_id,
        engineer_id !== undefined ? engineer_id : existing.engineer_id,
        id
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const getLinkedItems = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const taskResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = taskResult.rows[0];
    const linkedItems: any = {
      task: task,
      shop_drawing: null,
      rfi: null,
      meeting: null,
      engineer: null
    };

    if (task.shop_drawing_id) {
      const sdResult = await pool.query('SELECT * FROM shop_drawings WHERE id = $1', [task.shop_drawing_id]);
      linkedItems.shop_drawing = sdResult.rows[0] || null;
    }

    if (task.rfi_id) {
      const rfiResult = await pool.query('SELECT * FROM rfis WHERE id = $1', [task.rfi_id]);
      linkedItems.rfi = rfiResult.rows[0] || null;
    }

    if (task.meeting_id) {
      const meetingResult = await pool.query('SELECT * FROM meeting_minutes WHERE id = $1', [task.meeting_id]);
      linkedItems.meeting = meetingResult.rows[0] || null;
    }

    if (task.engineer_id) {
      const engineerResult = await pool.query('SELECT * FROM engineers WHERE id = $1', [task.engineer_id]);
      linkedItems.engineer = engineerResult.rows[0] || null;
    }

    res.json(linkedItems);
  } catch (error) {
    console.error('Error fetching linked items:', error);
    res.status(500).json({ error: 'Failed to fetch linked items' });
  }
};
