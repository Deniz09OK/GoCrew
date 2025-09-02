const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// Endpoint temporaire pour migration de la base de données
router.post('/migrate', async (req, res) => {
    try {
        // Ajouter les colonnes manquantes à la table tasks
        await pool.query(`
            ALTER TABLE tasks 
            ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'Préparatif',
            ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);

        // Initialiser les positions pour les tâches existantes
        const { rows: existingTasks } = await pool.query(`
            SELECT id, crew_id, status, created_at
            FROM tasks 
            ORDER BY crew_id, status, created_at
        `);

        // Mettre à jour les positions une par une
        let positionMap = {};
        for (const task of existingTasks) {
            const key = `${task.crew_id}-${task.status}`;
            if (!positionMap[key]) {
                positionMap[key] = 1;
            }
            
            await pool.query(
                'UPDATE tasks SET position = $1 WHERE id = $2',
                [positionMap[key], task.id]
            );
            
            positionMap[key]++;
        }

        res.json({ message: 'Migration réussie - colonnes ajoutées à la table tasks' });
    } catch (err) {
        console.error('Erreur migration:', err);
        res.status(500).json({ error: err.message });
    }
});

// Endpoint pour vérifier la structure de la table
router.get('/structure', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT column_name, data_type, column_default, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'tasks'
            ORDER BY ordinal_position
        `);
        res.json(rows);
    } catch (err) {
        console.error('Erreur structure:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
