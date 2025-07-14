const pool = require('../models/db');

exports.getAllCrewMembers = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM crew_members');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addCrewMember = async (req, res) => {
    const { crew_id, user_id, role, label } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO crew_members (crew_id, user_id, role, label)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [crew_id, user_id, role || 'member', label]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
