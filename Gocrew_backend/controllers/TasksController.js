const pool = require('../models/db');

// Récupérer toutes les tâches d'un crew
exports.getTasksByCrewId = async (req, res) => {
    const { crewId } = req.params;
    try {
        const { rows } = await pool.query(
            `SELECT t.*, u.first_name, u.last_name 
             FROM tasks t 
             LEFT JOIN users u ON t.assigned_to = u.id 
             WHERE t.crew_id = $1 
             ORDER BY t.position, t.created_at`,
            [crewId]
        );
        res.json(rows);
    } catch (err) {
        console.error('Erreur récupération tâches:', err);
        res.status(500).json({ error: err.message });
    }
};

// Récupérer toutes les tâches
exports.getAllTasks = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Créer une nouvelle tâche
exports.createTask = async (req, res) => {
    const { crew_id, title, description, status = 'À faire', priority = 'Préparatif', assigned_to, due_date, file_url } = req.body;
    
    try {
        // Obtenir la position suivante pour cette colonne
        const { rows: positionRows } = await pool.query(
            'SELECT COALESCE(MAX(position), 0) + 1 as next_position FROM tasks WHERE crew_id = $1 AND status = $2',
            [crew_id, status]
        );
        const position = positionRows[0].next_position;

        const { rows } = await pool.query(
            `INSERT INTO tasks (crew_id, title, description, status, priority, assigned_to, due_date, file_url, position)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [crew_id, title, description, status, priority, assigned_to, due_date, file_url, position]
        );
        
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error('Erreur création tâche:', err);
        res.status(500).json({ error: err.message });
    }
};

// Mettre à jour une tâche
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority, assigned_to, due_date, file_url, position, likes } = req.body;
    
    try {
        const { rows } = await pool.query(
            `UPDATE tasks 
             SET title = COALESCE($1, title), 
                 description = COALESCE($2, description),
                 status = COALESCE($3, status),
                 priority = COALESCE($4, priority),
                 assigned_to = COALESCE($5, assigned_to),
                 due_date = COALESCE($6, due_date),
                 file_url = COALESCE($7, file_url),
                 position = COALESCE($8, position),
                 likes = COALESCE($9, likes),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $10 
             RETURNING *`,
            [title, description, status, priority, assigned_to, due_date, file_url, position, likes, id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Tâche non trouvée' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        console.error('Erreur mise à jour tâche:', err);
        res.status(500).json({ error: err.message });
    }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    
    try {
        const { rows } = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Tâche non trouvée' });
        }
        
        res.json({ message: 'Tâche supprimée avec succès', task: rows[0] });
    } catch (err) {
        console.error('Erreur suppression tâche:', err);
        res.status(500).json({ error: err.message });
    }
};

// Réorganiser les tâches (drag & drop)
exports.reorderTasks = async (req, res) => {
    const { tasks } = req.body; // Array de { id, status, position }
    
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        for (const task of tasks) {
            await client.query(
                'UPDATE tasks SET status = $1, position = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
                [task.status, task.position, task.id]
            );
        }
        
        await client.query('COMMIT');
        res.json({ message: 'Tâches réorganisées avec succès' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Erreur réorganisation tâches:', err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};

// Liker/Unlike une tâche
exports.toggleLike = async (req, res) => {
    const { id } = req.params;
    
    try {
        const { rows } = await pool.query(
            'UPDATE tasks SET likes = likes + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Tâche non trouvée' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        console.error('Erreur toggle like:', err);
        res.status(500).json({ error: err.message });
    }
};
