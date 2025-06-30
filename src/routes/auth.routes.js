const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: 'Email et mot de passe requis.' });

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0)
            return res.status(401).json({ error: 'Utilisateur non trouvé.' });

        const user = result.rows[0];
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid)
            return res.status(401).json({ error: 'Mot de passe incorrect.' });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

router.post('/register', async (req, res) => {
    console.log('POST /register body:', req.body); 
    const { email, password, username } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: 'Email et mot de passe requis.' });

    try {
        const hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id, email, username',
            [email, hash, username || null]
        );
        console.log('Résultat insertion:', result.rows); // Ajout du log
        res.status(201).json({ user: result.rows[0] });
    } catch (err) {
        console.error('Erreur serveur register:', err); // Log complet
        if (err.code === '23505') {
            res.status(409).json({ error: 'Email déjà utilisé.' });
        } else {
            res.status(500).json({ error: 'Erreur serveur.' });
        }
    }
});

module.exports = router;
