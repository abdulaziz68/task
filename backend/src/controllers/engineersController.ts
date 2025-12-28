import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query;
    let query = 'SELECT * FROM engineers WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (search) {
      query += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR company ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ' ORDER BY name ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching engineers:', error);
    res.status(500).json({ error: 'Failed to fetch engineers' });
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM engineers WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Engineer not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching engineer:', error);
    res.status(500).json({ error: 'Failed to fetch engineer' });
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      specialization,
      company,
      contract_start_date,
      contract_end_date,
      status,
      hourly_rate,
      notes
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const result = await pool.query(
      `INSERT INTO engineers (name, email, phone, specialization, company, contract_start_date,
       contract_end_date, status, hourly_rate, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        name,
        email,
        phone,
        specialization,
        company,
        contract_start_date,
        contract_end_date,
        status || 'active',
        hourly_rate,
        notes
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating engineer:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create engineer' });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      specialization,
      company,
      contract_start_date,
      contract_end_date,
      status,
      hourly_rate,
      notes
    } = req.body;

    const existingResult = await pool.query('SELECT * FROM engineers WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Engineer not found' });
    }

    const existing = existingResult.rows[0];

    const result = await pool.query(
      `UPDATE engineers
       SET name = $1, email = $2, phone = $3, specialization = $4, company = $5,
           contract_start_date = $6, contract_end_date = $7, status = $8, hourly_rate = $9,
           notes = $10, updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [
        name || existing.name,
        email || existing.email,
        phone !== undefined ? phone : existing.phone,
        specialization !== undefined ? specialization : existing.specialization,
        company !== undefined ? company : existing.company,
        contract_start_date !== undefined ? contract_start_date : existing.contract_start_date,
        contract_end_date !== undefined ? contract_end_date : existing.contract_end_date,
        status || existing.status,
        hourly_rate !== undefined ? hourly_rate : existing.hourly_rate,
        notes !== undefined ? notes : existing.notes,
        id
      ]
    );

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating engineer:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to update engineer' });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM engineers WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Engineer not found' });
    }

    res.json({ message: 'Engineer deleted successfully' });
  } catch (error) {
    console.error('Error deleting engineer:', error);
    res.status(500).json({ error: 'Failed to delete engineer' });
  }
};
