const pool = require('../models/db');

exports.getAllCrews = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM crews');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCrewById = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM crews WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Crew non trouvé' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCrew = async (req, res) => {
    const { name, description, destination, budget, start_date, end_date, owner_id } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO crews (name, description, destination, budget, start_date, end_date, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [name, description, destination, budget, start_date, end_date, owner_id]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
