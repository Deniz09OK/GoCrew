const pool = require('../models/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'task-documents');
        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Générer un nom unique pour éviter les conflits
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

// Filtres pour les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png', 
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier non autorisé'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max
    }
});

exports.getAllDocuments = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM documents');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.uploadDocument = async (req, res) => {
    const { crew_id, uploader_id, file_name, file_url, token } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO documents (crew_id, uploader_id, file_name, file_url, token)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [crew_id, uploader_id, file_name, file_url, token]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupérer tous les documents d'une tâche
exports.getTaskDocuments = async (req, res) => {
    const { taskId } = req.params;
    
    try {
        const { rows } = await pool.query(
            `SELECT d.*, u.username as uploaded_by_name 
             FROM documents d 
             LEFT JOIN users u ON d.uploader_id = u.id 
             WHERE d.task_id = $1 
             ORDER BY d.uploaded_at DESC`,
            [taskId]
        );
        res.json(rows);
    } catch (err) {
        console.error('Erreur récupération documents:', err);
        res.status(500).json({ error: err.message });
    }
};

// Uploader un document pour une tâche
exports.uploadTaskDocument = [
    upload.single('document'),
    async (req, res) => {
        const { taskId } = req.params;
        const userId = req.user?.id; // Assumant que vous avez un middleware d'authentification
        
        if (!req.file) {
            return res.status(400).json({ error: 'Aucun fichier fourni' });
        }
        
        try {
            // Vérifier que la tâche existe
            const { rows: taskRows } = await pool.query(
                'SELECT id FROM tasks WHERE id = $1',
                [taskId]
            );
            
            if (taskRows.length === 0) {
                // Supprimer le fichier uploadé si la tâche n'existe pas
                fs.unlinkSync(req.file.path);
                return res.status(404).json({ error: 'Tâche non trouvée' });
            }
            
            // Construire l'URL du fichier
            const fileUrl = `/uploads/task-documents/${req.file.filename}`;
            
            // Insérer le document en base
            const { rows } = await pool.query(
                `INSERT INTO documents (task_id, crew_id, uploader_id, file_name, file_url, file_type, file_size)
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [
                    taskId,
                    null, // crew_id sera défini via la tâche si nécessaire
                    userId,
                    req.file.originalname,
                    fileUrl,
                    req.file.mimetype,
                    req.file.size
                ]
            );
            
            // Mettre à jour le compteur de documents de la tâche (optionnel)
            await pool.query(
                'UPDATE tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
                [taskId]
            );
            
            res.status(201).json(rows[0]);
        } catch (err) {
            // Supprimer le fichier en cas d'erreur
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            console.error('Erreur upload document:', err);
            res.status(500).json({ error: err.message });
        }
    }
];

// Supprimer un document
exports.deleteTaskDocument = async (req, res) => {
    const { documentId } = req.params;
    
    try {
        // Récupérer les infos du document
        const { rows: docRows } = await pool.query(
            'SELECT * FROM documents WHERE id = $1',
            [documentId]
        );
        
        if (docRows.length === 0) {
            return res.status(404).json({ error: 'Document non trouvé' });
        }
        
        const document = docRows[0];
        
        // Supprimer de la base de données
        await pool.query('DELETE FROM documents WHERE id = $1', [documentId]);
        
        // Supprimer le fichier physique
        const filePath = path.join(__dirname, '..', 'uploads', 'task-documents', path.basename(document.file_url));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        res.json({ message: 'Document supprimé avec succès' });
    } catch (err) {
        console.error('Erreur suppression document:', err);
        res.status(500).json({ error: err.message });
    }
};

// Télécharger un document
exports.downloadTaskDocument = async (req, res) => {
    const { documentId } = req.params;
    
    try {
        const { rows } = await pool.query(
            'SELECT * FROM documents WHERE id = $1',
            [documentId]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Document non trouvé' });
        }
        
        const document = rows[0];
        const filePath = path.join(__dirname, '..', 'uploads', 'task-documents', path.basename(document.file_url));
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Fichier non trouvé sur le serveur' });
        }
        
        res.download(filePath, document.file_name);
    } catch (err) {
        console.error('Erreur téléchargement document:', err);
        res.status(500).json({ error: err.message });
    }
};
