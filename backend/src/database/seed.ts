import pool from '../config/database';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('Starting database seeding...');
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await pool.query(
      `INSERT INTO users (username, email, password_hash, full_name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (username) DO NOTHING`,
      ['admin', 'admin@tasklinker.com', hashedPassword, 'System Administrator']
    );
    
    console.log('Database seeded successfully!');
    console.log('Default credentials:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
