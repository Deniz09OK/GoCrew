const pool = require('../models/db');

exports.getAllCrews = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM crews');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCrewById = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM crews WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Crew non trouvé' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCrew = async (req, res) => {
    const { name, description, destination, budget, start_date, end_date, owner_id, invites } = req.body;
    
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // 1. Create the crew
        const crewResult = await client.query(
            `INSERT INTO crews (name, description, destination, budget, start_date, end_date, owner_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [name, description, destination, budget, start_date, end_date, owner_id]
        );
        
        const crew = crewResult.rows[0];
        
        // 2. Add the owner as a crew member
        await client.query(
            `INSERT INTO crew_members (crew_id, user_id, role)
             VALUES ($1, $2, $3)`,
            [crew.id, owner_id, 'owner']
        );
        
        // 3. Process invitations if provided
        if (invites && Array.isArray(invites)) {
            for (const invite of invites) {
                if (invite.email && invite.email.trim()) {
                    // Find user by email
                    const userResult = await client.query(
                        'SELECT id FROM users WHERE email = $1',
                        [invite.email.trim()]
                    );
                    
                    if (userResult.rows.length > 0) {
                        const userId = userResult.rows[0].id;
                        
                        // Check if user is not already a member
                        const existingMemberResult = await client.query(
                            'SELECT id FROM crew_members WHERE crew_id = $1 AND user_id = $2',
                            [crew.id, userId]
                        );
                        
                        if (existingMemberResult.rows.length === 0) {
                            // Add user to crew
                            await client.query(
                                `INSERT INTO crew_members (crew_id, user_id, role)
                                 VALUES ($1, $2, $3)`,
                                [crew.id, userId, invite.role || 'member']
                            );
                        }
                    }
                    // If user doesn't exist, we could send an invitation email here
                    // For now, we just skip non-existing users
                }
            }
        }
        
        await client.query('COMMIT');
        res.status(201).json(crew);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};
