const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// Affiche toutes les annonces publiques
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM travel_announcements WHERE is_public = TRUE');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crée une annonce publique et ajoute le créateur comme viewer ou member
router.post('/', async (req, res) => {
    const { title, description, destination, budget, start_date, end_date, role } = req.body;
    // owner_id doit être déterminé côté backend (ex: via le token JWT)
    const owner_id = 1; // À remplacer par l'id réel de l'utilisateur connecté
    try {
        // Crée une crew dédiée à l'annonce
        const crewResult = await pool.query(
            `INSERT INTO crews (name, description, destination, budget, start_date, end_date, owner_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [title, description, destination, budget, start_date, end_date, owner_id]
        );
        const crew = crewResult.rows[0];

        // Crée l'annonce publique liée à cette crew
        const annResult = await pool.query(
            `INSERT INTO travel_announcements (title, description, crew_id, is_public)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [title, description, crew.id, true]
        );
        const announcement = annResult.rows[0];

        // Ajoute le créateur dans crew_members avec le rôle choisi
        await pool.query(
            `INSERT INTO crew_members (crew_id, user_id, role) VALUES ($1, $2, $3)`,
            [crew.id, owner_id, role || 'viewer']
        );

        res.status(201).json({ announcement });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
