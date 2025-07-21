const express = require('express');
const router = express.Router();
const pool = require('../models/db');

console.log('CreateCrewRoutes chargé');

// Créer une Crew et inviter des membres par email
router.post('/', async (req, res) => {
    const { name, description, destination, budget, currency, start_date, end_date, invited_users } = req.body;
    // owner_id doit être déterminé côté backend (par exemple via le token JWT)
    // Pour le test, tu peux mettre owner_id = 1 ou autre valeur fixe
    const owner_id = 1; // À remplacer par l'id réel de l'utilisateur connecté

    if (!name || !owner_id) {
        return res.status(400).json({ error: 'Nom et owner_id requis.' });
    }
    try {
        // Créer la crew
        const crewResult = await pool.query(
            `INSERT INTO crews (name, description, destination, budget, start_date, end_date, owner_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [name, description, destination, budget, start_date, end_date, owner_id]
        );
        const crew = crewResult.rows[0];

        // Ajouter le owner comme membre (role: owner)
        await pool.query(
            `INSERT INTO crew_members (crew_id, user_id, role) VALUES ($1, $2, $3)`,
            [crew.id, owner_id, 'owner']
        );

        // Inviter les autres membres par email
        if (Array.isArray(invited_users)) {
            for (const user of invited_users) {
                if (user.email) {
                    // Chercher l'utilisateur par email
                    const userRes = await pool.query('SELECT id FROM users WHERE email = $1', [user.email]);
                    if (userRes.rows.length > 0) {
                        const user_id = userRes.rows[0].id;
                        // Ne pas ajouter le owner deux fois
                        if (user_id !== owner_id) {
                            await pool.query(
                                `INSERT INTO crew_members (crew_id, user_id, role) VALUES ($1, $2, $3)`,
                                [crew.id, user_id, user.role || 'viewer']
                            );
                        }
                    }
                    // Sinon, tu pourrais envoyer une invitation par mail ici (optionnel)
                }
            }
        }

        res.status(201).json({ crew });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
