const pool = require('../models/db');

exports.getAllTasks = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM tasks');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createTask = async (req, res) => {
    const { crew_id, title, description, status, assigned_to, due_date } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO tasks (crew_id, title, description, status, assigned_to, due_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [crew_id, title, description, status || 'todo', assigned_to, due_date]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
