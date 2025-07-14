const pool = require('../models/db');

exports.getAllDocuments = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM documents');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.uploadDocument = async (req, res) => {
    const { crew_id, uploader_id, file_name, file_url, token } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO documents (crew_id, uploader_id, file_name, file_url, token)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [crew_id, uploader_id, file_name, file_url, token]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
