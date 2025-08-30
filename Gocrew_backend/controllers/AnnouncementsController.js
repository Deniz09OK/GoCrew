const pool = require('../models/db');

exports.getAllAnnouncements = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM travel_announcements WHERE is_public = TRUE');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createAnnouncement = async (req, res) => {
    const { title, description, crew_id, is_public } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO travel_announcements (title, description, crew_id, is_public)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [title, description, crew_id, is_public ?? true]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
