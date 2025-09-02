const pool = require('../models/db');

exports.getAllAnnouncements = async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                ta.*,
                c.name as crew_name,
                c.description as crew_description,
                c.destination,
                c.budget,
                c.start_date,
                c.end_date,
                c.created_at as crew_created_at,
                u.username as owner_username,
                u.email as owner_email,
                (SELECT COUNT(*) FROM crew_members cm WHERE cm.crew_id = c.id) as participants_count
            FROM travel_announcements ta
            LEFT JOIN crews c ON ta.crew_id = c.id
            LEFT JOIN users u ON c.owner_id = u.id
            WHERE ta.is_public = TRUE
            ORDER BY ta.posted_at DESC
        `);
        
        // Formater les données pour le frontend
        const formattedRows = rows.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            posted_at: row.posted_at,
            is_public: row.is_public,
            crew: {
                id: row.crew_id,
                name: row.crew_name,
                description: row.crew_description,
                destination: row.destination,
                budget: row.budget,
                start_date: row.start_date,
                end_date: row.end_date,
                created_at: row.crew_created_at,
                owner: {
                    username: row.owner_username,
                    email: row.owner_email
                },
                participants_count: parseInt(row.participants_count) || 0
            }
        }));
        
        res.json(formattedRows);
    } catch (err) {
        console.error('Erreur récupération annonces:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.createAnnouncement = async (req, res) => {
    const { title, description, crew_id, is_public } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO travel_announcements (title, description, crew_id, is_public)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [title, description, crew_id, is_public ?? true]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
