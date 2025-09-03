const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticateToken } = require('../middleware/auth');

// Rejoindre une annonce (devient viewer par défaut)
router.post('/participants', authenticateToken, async (req, res) => {
    try {
        const { announcement_id, role = 'viewer' } = req.body;
        const user_id = req.user.id;

        // Vérifier si l'utilisateur est déjà participant
        const existingParticipant = await pool.query(
            'SELECT * FROM announcement_participants WHERE announcement_id = $1 AND user_id = $2',
            [announcement_id, user_id]
        );

        if (existingParticipant.rows.length > 0) {
            return res.status(400).json({ error: 'Vous participez déjà à cette annonce' });
        }

        // Ajouter le participant
        const result = await pool.query(
            'INSERT INTO announcement_participants (announcement_id, user_id, role) VALUES ($1, $2, $3) RETURNING *',
            [announcement_id, user_id, role]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de l\'ajout du participant:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Obtenir les participants d'une annonce
router.get('/:announcementId/participants', authenticateToken, async (req, res) => {
    try {
        const { announcementId } = req.params;

        const result = await pool.query(
            `SELECT ap.*, u.username, u.email 
             FROM announcement_participants ap 
             JOIN users u ON ap.user_id = u.id 
             WHERE ap.announcement_id = $1 
             ORDER BY ap.joined_at`,
            [announcementId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des participants:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Changer le rôle d'un participant (seul l'owner peut faire ça)
router.put('/participants/:participantId/role', authenticateToken, async (req, res) => {
    try {
        const { participantId } = req.params;
        const { role } = req.body;
        const user_id = req.user.id;

        if (!['viewer', 'member', 'owner'].includes(role)) {
            return res.status(400).json({ error: 'Rôle invalide' });
        }

        // Vérifier si l'utilisateur est owner de l'annonce
        const ownerCheck = await pool.query(
            `SELECT ap1.announcement_id 
             FROM announcement_participants ap1
             JOIN announcement_participants ap2 ON ap1.announcement_id = ap2.announcement_id
             WHERE ap1.user_id = $1 AND ap1.role = 'owner' AND ap2.id = $2`,
            [user_id, participantId]
        );

        if (ownerCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Seul le propriétaire peut modifier les rôles' });
        }

        // Mettre à jour le rôle
        const result = await pool.query(
            'UPDATE announcement_participants SET role = $1 WHERE id = $2 RETURNING *',
            [role, participantId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Participant non trouvé' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la modification du rôle:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Quitter une annonce
router.delete('/participants/:participantId', authenticateToken, async (req, res) => {
    try {
        const { participantId } = req.params;
        const user_id = req.user.id;

        // Vérifier si l'utilisateur peut supprimer ce participant
        const participant = await pool.query(
            'SELECT * FROM announcement_participants WHERE id = $1',
            [participantId]
        );

        if (participant.rows.length === 0) {
            return res.status(404).json({ error: 'Participant non trouvé' });
        }

        const participantData = participant.rows[0];

        // L'utilisateur peut supprimer sa propre participation ou s'il est owner
        const isOwner = await pool.query(
            'SELECT * FROM announcement_participants WHERE announcement_id = $1 AND user_id = $2 AND role = \'owner\'',
            [participantData.announcement_id, user_id]
        );

        if (participantData.user_id !== user_id && isOwner.rows.length === 0) {
            return res.status(403).json({ error: 'Vous n\'avez pas les permissions pour supprimer ce participant' });
        }

        // Empêcher la suppression du dernier owner
        if (participantData.role === 'owner') {
            const ownerCount = await pool.query(
                'SELECT COUNT(*) FROM announcement_participants WHERE announcement_id = $1 AND role = \'owner\'',
                [participantData.announcement_id]
            );

            if (parseInt(ownerCount.rows[0].count) === 1) {
                return res.status(400).json({ error: 'Impossible de supprimer le dernier propriétaire' });
            }
        }

        await pool.query('DELETE FROM announcement_participants WHERE id = $1', [participantId]);

        res.json({ message: 'Participant supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du participant:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Obtenir les annonces auxquelles un utilisateur participe
router.get('/my-participations', authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.id;

        const result = await pool.query(
            `SELECT ta.*, ap.role, ap.joined_at, c.destination, c.start_date, c.end_date, c.budget,
                    u.username as owner_name,
                    COUNT(ap2.id) as participant_count
             FROM announcement_participants ap
             JOIN travel_announcements ta ON ap.announcement_id = ta.id
             LEFT JOIN crews c ON ta.crew_id = c.id
             LEFT JOIN users u ON c.owner_id = u.id
             LEFT JOIN announcement_participants ap2 ON ta.id = ap2.announcement_id
             WHERE ap.user_id = $1
             GROUP BY ta.id, ta.title, ta.description, ta.crew_id, ta.is_public, ta.posted_at, 
                      ap.role, ap.joined_at, c.destination, c.start_date, c.end_date, c.budget, 
                      c.name, c.max_participants, u.username
             ORDER BY ap.joined_at DESC`,
            [user_id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des participations:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
