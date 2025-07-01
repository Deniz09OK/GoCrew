const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
console.log('DATABASE_URL chargée :', connectionString);

const pool = new Pool({ connectionString });

router.post('/login', async (req, res) => {
    console.log('POST /login body:', req.body);
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis.' });

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0)
            return res.status(401).json({ error: 'Utilisateur non trouvé.' });

        const user = result.rows[0];
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid)
            return res.status(401).json({ error: 'Mot de passe incorrect.' });

        const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

router.post('/register', async (req, res) => {
    console.log('POST /register body:', req.body); 
    const { email, password, username, avatar_url } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: 'Email et mot de passe requis.' });

    try {
        const hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, username, avatar_url) VALUES ($1, $2, $3, $4) RETURNING id, email, username, role, avatar_url',
            [email, hash, username || null, avatar_url || null]
        );
        console.log('Résultat insertion:', result.rows); 
        res.status(201).json({ user: result.rows[0] });
    } catch (err) {
        console.error('Erreur serveur register:', err.message, err.stack);
        if (err.code === '23505') {
            res.status(409).json({ error: 'Email déjà utilisé.' });
        } else {
            res.status(500).json({ error: 'Erreur serveur: ' + err.message });
        }
    }
});

module.exports = router;
