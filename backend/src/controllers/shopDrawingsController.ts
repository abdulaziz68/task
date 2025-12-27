import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query;
    let query = 'SELECT * FROM shop_drawings WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (search) {
      query += ` AND (title ILIKE $${paramCount} OR drawing_number ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching shop drawings:', error);
    res.status(500).json({ error: 'Failed to fetch shop drawings' });
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM shop_drawings WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shop drawing not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching shop drawing:', error);
    res.status(500).json({ error: 'Failed to fetch shop drawing' });
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, drawing_number, revision, status } = req.body;
    const file = req.file;

    if (!title || !drawing_number) {
      return res.status(400).json({ error: 'Title and drawing number are required' });
    }

    const result = await pool.query(
      `INSERT INTO shop_drawings (title, description, drawing_number, revision, status, file_path, file_name, file_size, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        title,
        description,
        drawing_number,
        revision,
        status || 'pending',
        file?.path,
        file?.originalname,
        file?.size,
        req.user?.id
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating shop drawing:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Drawing number already exists' });
    }
    res.status(500).json({ error: 'Failed to create shop drawing' });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, drawing_number, revision, status } = req.body;
    const file = req.file;

    const existingResult = await pool.query('SELECT * FROM shop_drawings WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Shop drawing not found' });
    }

    const existing = existingResult.rows[0];

    if (file && existing.file_path) {
      try {
        fs.unlinkSync(existing.file_path);
      } catch (err) {
        console.error('Error deleting old file:', err);
      }
    }

    const result = await pool.query(
      `UPDATE shop_drawings
       SET title = $1, description = $2, drawing_number = $3, revision = $4, status = $5,
           file_path = $6, file_name = $7, file_size = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [
        title || existing.title,
        description !== undefined ? description : existing.description,
        drawing_number || existing.drawing_number,
        revision !== undefined ? revision : existing.revision,
        status || existing.status,
        file?.path || existing.file_path,
        file?.originalname || existing.file_name,
        file?.size || existing.file_size,
        id
      ]
    );

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating shop drawing:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Drawing number already exists' });
    }
    res.status(500).json({ error: 'Failed to update shop drawing' });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM shop_drawings WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shop drawing not found' });
    }

    const drawing = result.rows[0];
    if (drawing.file_path) {
      try {
        fs.unlinkSync(drawing.file_path);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    await pool.query('DELETE FROM shop_drawings WHERE id = $1', [id]);
    res.json({ message: 'Shop drawing deleted successfully' });
  } catch (error) {
    console.error('Error deleting shop drawing:', error);
    res.status(500).json({ error: 'Failed to delete shop drawing' });
  }
};

export const downloadFile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM shop_drawings WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shop drawing not found' });
    }

    const drawing = result.rows[0];
    if (!drawing.file_path) {
      return res.status(404).json({ error: 'No file attached' });
    }

    if (!fs.existsSync(drawing.file_path)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    res.download(drawing.file_path, drawing.file_name);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
};
