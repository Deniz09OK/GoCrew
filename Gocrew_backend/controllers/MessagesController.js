const pool = require('../models/db');

exports.getAllMessages = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM messages ORDER BY sent_at ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMessagesByCrew = async (req, res) => {
    const { crew_id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM messages WHERE crew_id = $1 ORDER BY sent_at ASC', [crew_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.sendMessage = async (req, res) => {
    const { crew_id, sender_id, content } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO messages (crew_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *',
            [crew_id, sender_id, content]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
