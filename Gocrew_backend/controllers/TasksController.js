const pool = require('../models/db');

exports.getAllTasks = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM tasks');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createTask = async (req, res) => {
    const { crew_id, title, description, status, assigned_to, due_date } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO tasks (crew_id, title, description, status, assigned_to, due_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [crew_id, title, description, status || 'todo', assigned_to, due_date]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        // Récupère la tâche existante
        const current = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if (current.rows.length === 0) return res.status(404).json({ error: 'Tâche non trouvée' });
        const task = current.rows[0];

        const newTitle = title !== undefined ? title : task.title;
        const newDescription = description !== undefined ? description : task.description;
        const newStatus = status !== undefined ? status : task.status;

        const { rows } = await pool.query(
            `UPDATE tasks SET
                title = $1,
                description = $2,
                status = $3
             WHERE id = $4 RETURNING *`,
            [newTitle, newDescription, newStatus, id]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        if (rowCount === 0) return res.status(404).json({ error: 'Tâche non trouvée' });
        res.json({ message: 'Tâche supprimée' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
