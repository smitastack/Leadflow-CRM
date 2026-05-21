import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* TEST ROUTE */
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      message: 'Database connected successfully',
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Database connection failed',
    });
  }
});


/* GET LEADS */
app.get('/api/leads', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        leads.*,

        (
          SELECT note
          FROM discussions
          WHERE discussions.lead_id = leads.id
          ORDER BY created_at DESC
          LIMIT 1
        ) AS last_discussion,

        (
          SELECT created_at
          FROM discussions
          WHERE discussions.lead_id = leads.id
          ORDER BY created_at DESC
          LIMIT 1
        ) AS last_discussion_time

      FROM leads
      ORDER BY created_at DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch leads',
    });
  }
});



/* CREATE LEAD */
app.post('/api/leads', async (req, res) => {
  try {
    const {
      name,
      company,
      phone,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO leads
      (name, company, phone)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [
        name,
        company,
        phone,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to create lead',
    });
  }
});

/* GET DISCUSSIONS FOR A LEAD */
app.get(
  '/api/leads/:id/discussions',
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `
        SELECT *
        FROM discussions
        WHERE lead_id = $1
        ORDER BY created_at DESC
        `,
        [id]
      );

      res.json(result.rows);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: 'Failed to fetch discussions',
      });
    }
  }
);

/* CREATE DISCUSSION */
app.post(
  '/api/leads/:id/discussions',
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        note,
        follow_up_at,
      } = req.body;

      // VALIDATION
      if (!note || !note.trim()) {
        return res.status(400).json({
          error: 'Discussion note is required',
        });
      }

      // INSERT DISCUSSION
      const discussionResult =
        await pool.query(
          `
          INSERT INTO discussions
          (lead_id, note)
          VALUES ($1, $2)
          RETURNING *
          `,
          [id, note]
        );

      // UPDATE FOLLOW-UP
      if (follow_up_at) {
        await pool.query(
          `
          UPDATE leads
          SET
            follow_up_at = $1,
            updated_at = NOW()
          WHERE id = $2
          `,
          [follow_up_at, id]
        );
      }

      res.status(201).json(
        discussionResult.rows[0]
      );

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: 'Failed to create discussion',
      });
    }
  }
);

/* UPDATE LEAD STATUS */
app.patch(
  '/api/leads/:id',
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        status,
        follow_up_at,
      } = req.body;

      const result = await pool.query(
        `
        UPDATE leads
        SET
          status = COALESCE($1, status),
          follow_up_at = COALESCE($2, follow_up_at),
          updated_at = NOW()
        WHERE id = $3
        RETURNING *
        `,
        [
          status || null,
          follow_up_at || null,
          id,
        ]
      );

      res.json(result.rows[0]);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: 'Failed to update lead',
      });
    }
  }
);

/* SERVER */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});