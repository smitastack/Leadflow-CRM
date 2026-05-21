import { pool } from './db.js';

async function seedDatabase() {
  try {
    console.log('Seeding database...');

    // CLEAR OLD DATA
    await pool.query('DELETE FROM discussions');
    await pool.query('DELETE FROM leads');

    // RESET ID COUNTERS
    await pool.query(
      `ALTER SEQUENCE leads_id_seq RESTART WITH 1`
    );

    await pool.query(
      `ALTER SEQUENCE discussions_id_seq RESTART WITH 1`
    );

    // INSERT LEADS
    await pool.query(`
      INSERT INTO leads 
      (name, company, phone, status, follow_up_at)
      VALUES

      (
        'Emily Johnson',
        'TechNova Solutions',
        '9876543210',
        'Contacted',
        NOW()
      ),

      (
        'John Smith',
        'CloudSync',
        '9123456780',
        'Qualified',
        NOW() - INTERVAL '2 days'
      ),

      (
        'Bruce Wayne',
        'Wayne Enterprises',
        '9988776655',
        'Proposal Sent',
        NOW() + INTERVAL '3 days'
      ),

      (
        'Sarah Parker',
        'NextGen Labs',
        '9011223344',
        'New',
        NULL
      ),

      (
        'Tony Stark',
        'Stark Industries',
        '9090909090',
        'Won',
        NULL
      );
    `);

    // INSERT DISCUSSIONS
    await pool.query(`
      INSERT INTO discussions 
      (lead_id, note)
      VALUES

      (
        1,
        'Discussed onboarding requirements and pricing details.'
      ),

      (
        2,
        'Client requested final proposal after internal review.'
      ),

      (
        3,
        'Product demo completed successfully with management team.'
      ),

      (
        4,
        'Initial discovery call completed. Waiting for requirements document.'
      ),

      (
        5,
        'Contract signed successfully. Lead converted to customer.'
      );
    `);

    console.log('Database seeded successfully!');
    process.exit();

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();