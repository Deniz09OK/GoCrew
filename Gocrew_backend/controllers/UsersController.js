const pool = require('../models/db');

// Obtenir tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtenir un utilisateur par ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Créer un nouvel utilisateur
exports.createUser = async (req, res) => {
    const { email, password_hash, username, avatar_url, role } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO users (email, password_hash, username, avatar_url, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [email, password_hash, username, avatar_url, role || 'member']
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Modifier un utilisateur
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, password_hash, username, avatar_url, role } = req.body;
    try {
        const { rows } = await pool.query(
            'UPDATE users SET email=$1, password_hash=$2, username=$3, avatar_url=$4, role=$5 WHERE id=$6 RETURNING *',
            [email, password_hash, username, avatar_url, role, id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
        if (rowCount === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
        res.json({ message: 'Utilisateur supprimé' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
