const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

require('dotenv').config();

// Récupère la chaîne de connexion à la base de données depuis .env
const connectionString = process.env.DATABASE_URL;
console.log('DATABASE_URL chargée :', connectionString);

// Initialise le pool de connexions PostgreSQL
const pool = new Pool({ connectionString });

// Route de connexion utilisateur (login)
router.post('/login', async (req, res) => {
    console.log('POST /login body:', req.body);
    // Utilise email pour la connexion (modifie aussi ton front si besoin)
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: 'Email et mot de passe requis.' });

    try {
        // Recherche l'utilisateur par email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0)
            return res.status(401).json({ error: 'Utilisateur non trouvé.' });

        const user = result.rows[0];
        // Vérifie le mot de passe avec bcrypt
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid)
            return res.status(401).json({ error: 'Mot de passe incorrect.' });

        // Génère un token JWT valable 2 minute, inclut le rôle
        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2m' }
        );
        res.json({ token, user: { id: user.id, email: user.email, username: user.username, role: user.role } });
    } catch (err) {
        // Gestion des erreurs serveur
        console.error('Erreur serveur:', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

// Route d'inscription utilisateur (register)
router.post('/register', async (req, res) => {
    console.log('POST /register body:', req.body); 
    const { email, password, username, avatar_url } = req.body;
    // Vérifie que les champs obligatoires sont présents
    if (!email || !password)
        return res.status(400).json({ error: 'Email et mot de passe requis.' });

    try {
        // Hash le mot de passe avant insertion
        const hash = await bcrypt.hash(password, 10);
        // Insère le nouvel utilisateur dans la base avec le rôle 'member' par défaut
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, username, avatar_url, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, username, role, avatar_url',
            [email, hash, username || null, avatar_url || null, 'member']
        );
        console.log('Résultat insertion:', result.rows); 
        res.status(201).json({ user: result.rows[0] });
    } catch (err) {
        // Gestion des erreurs d'unicité ou autres
        console.error('Erreur serveur register:', err.message, err.stack);
        if (err.code === '23505') {
            res.status(409).json({ error: 'Email déjà utilisé.' });
        } else {
            res.status(500).json({ error: 'Erreur serveur: ' + err.message });
        }
    }
});

// Middleware pour vérifier le token JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token manquant.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token invalide ou expiré.' });
        req.user = user;
        next();
    });
}

// Exemple de route protégée
router.get('/me', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;

// NOTE: Pour créer le compte admin (owner), insère manuellement dans la base :
// INSERT INTO users (email, password_hash, username, role) VALUES ('admin@email.com', '<hash>', 'admin', 'owner');
