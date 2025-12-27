import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import fs from 'fs';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM meeting_minutes WHERE 1=1';
    const params: any[] = [];

    if (search) {
      query += ` AND (title ILIKE $1 OR meeting_number ILIKE $1)`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY meeting_date DESC, created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching meeting minutes:', error);
    res.status(500).json({ error: 'Failed to fetch meeting minutes' });
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const meetingResult = await pool.query('SELECT * FROM meeting_minutes WHERE id = $1', [id]);

    if (meetingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Meeting minutes not found' });
    }

    const attachmentsResult = await pool.query(
      'SELECT * FROM meeting_attachments WHERE meeting_id = $1',
      [id]
    );

    const meeting = {
      ...meetingResult.rows[0],
      attachments: attachmentsResult.rows
    };

    res.json(meeting);
  } catch (error) {
    console.error('Error fetching meeting minutes:', error);
    res.status(500).json({ error: 'Failed to fetch meeting minutes' });
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const {
      meeting_number,
      title,
      meeting_date,
      location,
      attendees,
      agenda,
      discussion,
      decisions,
      action_items,
      next_meeting
    } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!meeting_number || !title || !meeting_date) {
      return res.status(400).json({ error: 'Meeting number, title, and date are required' });
    }

    const result = await pool.query(
      `INSERT INTO meeting_minutes (meeting_number, title, meeting_date, location, attendees, 
       agenda, discussion, decisions, action_items, next_meeting, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        meeting_number,
        title,
        meeting_date,
        location,
        attendees,
        agenda,
        discussion,
        decisions,
        action_items,
        next_meeting,
        req.user?.id
      ]
    );

    const meeting = result.rows[0];

    if (files && files.length > 0) {
      for (const file of files) {
        await pool.query(
          `INSERT INTO meeting_attachments (meeting_id, file_path, file_name, file_size)
           VALUES ($1, $2, $3, $4)`,
          [meeting.id, file.path, file.originalname, file.size]
        );
      }
    }

    res.status(201).json(meeting);
  } catch (error: any) {
    console.error('Error creating meeting minutes:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Meeting number already exists' });
    }
    res.status(500).json({ error: 'Failed to create meeting minutes' });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      meeting_number,
      title,
      meeting_date,
      location,
      attendees,
      agenda,
      discussion,
      decisions,
      action_items,
      next_meeting
    } = req.body;

    const existingResult = await pool.query('SELECT * FROM meeting_minutes WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Meeting minutes not found' });
    }

    const existing = existingResult.rows[0];

    const result = await pool.query(
      `UPDATE meeting_minutes
       SET meeting_number = $1, title = $2, meeting_date = $3, location = $4, attendees = $5,
           agenda = $6, discussion = $7, decisions = $8, action_items = $9, next_meeting = $10,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [
        meeting_number || existing.meeting_number,
        title || existing.title,
        meeting_date || existing.meeting_date,
        location !== undefined ? location : existing.location,
        attendees !== undefined ? attendees : existing.attendees,
        agenda !== undefined ? agenda : existing.agenda,
        discussion !== undefined ? discussion : existing.discussion,
        decisions !== undefined ? decisions : existing.decisions,
        action_items !== undefined ? action_items : existing.action_items,
        next_meeting !== undefined ? next_meeting : existing.next_meeting,
        id
      ]
    );

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating meeting minutes:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Meeting number already exists' });
    }
    res.status(500).json({ error: 'Failed to update meeting minutes' });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const attachmentsResult = await pool.query(
      'SELECT * FROM meeting_attachments WHERE meeting_id = $1',
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

    const result = await pool.query('DELETE FROM meeting_minutes WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Meeting minutes not found' });
    }

    res.json({ message: 'Meeting minutes deleted successfully' });
  } catch (error) {
    console.error('Error deleting meeting minutes:', error);
    res.status(500).json({ error: 'Failed to delete meeting minutes' });
  }
};

export const addAttachment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const meetingResult = await pool.query('SELECT * FROM meeting_minutes WHERE id = $1', [id]);
    if (meetingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Meeting minutes not found' });
    }

    const result = await pool.query(
      `INSERT INTO meeting_attachments (meeting_id, file_path, file_name, file_size)
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

    const result = await pool.query('SELECT * FROM meeting_attachments WHERE id = $1', [attachmentId]);
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

    await pool.query('DELETE FROM meeting_attachments WHERE id = $1', [attachmentId]);
    res.json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    console.error('Error deleting attachment:', error);
    res.status(500).json({ error: 'Failed to delete attachment' });
  }
};

export const downloadAttachment = async (req: AuthRequest, res: Response) => {
  try {
    const { attachmentId } = req.params;
    const result = await pool.query('SELECT * FROM meeting_attachments WHERE id = $1', [attachmentId]);

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
