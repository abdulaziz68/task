import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import fs from 'fs';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const { status, priority, search } = req.query;
    let query = 'SELECT * FROM rfis WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (priority) {
      query += ` AND priority = $${paramCount}`;
      params.push(priority);
      paramCount++;
    }

    if (search) {
      query += ` AND (subject ILIKE $${paramCount} OR rfi_number ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching RFIs:', error);
    res.status(500).json({ error: 'Failed to fetch RFIs' });
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const rfiResult = await pool.query('SELECT * FROM rfis WHERE id = $1', [id]);

    if (rfiResult.rows.length === 0) {
      return res.status(404).json({ error: 'RFI not found' });
    }

    const attachmentsResult = await pool.query(
      'SELECT * FROM rfi_attachments WHERE rfi_id = $1',
      [id]
    );

    const rfi = {
      ...rfiResult.rows[0],
      attachments: attachmentsResult.rows
    };

    res.json(rfi);
  } catch (error) {
    console.error('Error fetching RFI:', error);
    res.status(500).json({ error: 'Failed to fetch RFI' });
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const { rfi_number, subject, description, priority, status, assigned_to, due_date } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!rfi_number || !subject || !description) {
      return res.status(400).json({ error: 'RFI number, subject, and description are required' });
    }

    const result = await pool.query(
      `INSERT INTO rfis (rfi_number, subject, description, priority, status, requested_by, assigned_to, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        rfi_number,
        subject,
        description,
        priority || 'medium',
        status || 'open',
        req.user?.id,
        assigned_to,
        due_date
      ]
    );

    const rfi = result.rows[0];

    if (files && files.length > 0) {
      for (const file of files) {
        await pool.query(
          `INSERT INTO rfi_attachments (rfi_id, file_path, file_name, file_size)
           VALUES ($1, $2, $3, $4)`,
          [rfi.id, file.path, file.originalname, file.size]
        );
      }
    }

    res.status(201).json(rfi);
  } catch (error: any) {
    console.error('Error creating RFI:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'RFI number already exists' });
    }
    res.status(500).json({ error: 'Failed to create RFI' });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rfi_number, subject, description, priority, status, assigned_to, due_date, response } = req.body;

    const existingResult = await pool.query('SELECT * FROM rfis WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'RFI not found' });
    }

    const existing = existingResult.rows[0];

    const result = await pool.query(
      `UPDATE rfis
       SET rfi_number = $1, subject = $2, description = $3, priority = $4, status = $5,
           assigned_to = $6, due_date = $7, response = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [
        rfi_number || existing.rfi_number,
        subject || existing.subject,
        description || existing.description,
        priority || existing.priority,
        status || existing.status,
        assigned_to !== undefined ? assigned_to : existing.assigned_to,
        due_date !== undefined ? due_date : existing.due_date,
        response !== undefined ? response : existing.response,
        id
      ]
    );

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating RFI:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'RFI number already exists' });
    }
    res.status(500).json({ error: 'Failed to update RFI' });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const attachmentsResult = await pool.query(
      'SELECT * FROM rfi_attachments WHERE rfi_id = $1',
      [id]
    );

    for (const attachment of attachmentsResult.rows) {
      try {
        if (fs.existsSync(attachment.file_path)) {
          fs.unlinkSync(attachment.file_path);
        }
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    const result = await pool.query('DELETE FROM rfis WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'RFI not found' });
    }

    res.json({ message: 'RFI deleted successfully' });
  } catch (error) {
    console.error('Error deleting RFI:', error);
    res.status(500).json({ error: 'Failed to delete RFI' });
  }
};

export const addAttachment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const rfiResult = await pool.query('SELECT * FROM rfis WHERE id = $1', [id]);
    if (rfiResult.rows.length === 0) {
      return res.status(404).json({ error: 'RFI not found' });
    }

    const result = await pool.query(
      `INSERT INTO rfi_attachments (rfi_id, file_path, file_name, file_size)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, file.path, file.originalname, file.size]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding attachment:', error);
    res.status(500).json({ error: 'Failed to add attachment' });
  }
};

export const deleteAttachment = async (req: AuthRequest, res: Response) => {
  try {
    const { attachmentId } = req.params;

    const result = await pool.query('SELECT * FROM rfi_attachments WHERE id = $1', [attachmentId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    const attachment = result.rows[0];
    try {
      if (fs.existsSync(attachment.file_path)) {
        fs.unlinkSync(attachment.file_path);
      }
    } catch (err) {
      console.error('Error deleting file:', err);
    }

    await pool.query('DELETE FROM rfi_attachments WHERE id = $1', [attachmentId]);
    res.json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    console.error('Error deleting attachment:', error);
    res.status(500).json({ error: 'Failed to delete attachment' });
  }
};

export const downloadAttachment = async (req: AuthRequest, res: Response) => {
  try {
    const { attachmentId } = req.params;
    const result = await pool.query('SELECT * FROM rfi_attachments WHERE id = $1', [attachmentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    const attachment = result.rows[0];
    if (!fs.existsSync(attachment.file_path)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    res.download(attachment.file_path, attachment.file_name);
  } catch (error) {
    console.error('Error downloading attachment:', error);
    res.status(500).json({ error: 'Failed to download attachment' });
  }
};
