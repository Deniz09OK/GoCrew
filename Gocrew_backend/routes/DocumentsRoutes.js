const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require('../models/db');
const path = require('path');

// Extensions autorisées
const allowedExtensions = [
  '.pdf', '.gif', '.jpg', '.jpeg', '.jfif', '.pjpeg', '.pjp', '.png', '.svg',
  '.docx', '.xlsx', '.pptx'
];

// Utilise multer en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage, fileFilter: (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace(/\s/g, '');
  if (allowedExtensions.includes(ext)) cb(null, true);
  else cb(new Error('Extension de fichier non autorisée'), false);
}, limits: { fileSize: 10 * 1024 * 1024 } }); // 10 Mo max

// Upload d'un fichier lié à une annonce ou crew (POST)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier envoyé ou extension non autorisée.' });
    const { announcementId, crewId } = req.body;
    // uploader_id à récupérer via l'authentification (ici exemple user_id=1)
    const uploader_id = 1;
    let crew_id = crewId;
    // Si upload pour une annonce, récupère crew_id via la table travel_announcements
    if (announcementId && !crew_id) {
      const ann = await pool.query('SELECT crew_id FROM travel_announcements WHERE id = $1', [announcementId]);
      if (ann.rows.length) crew_id = ann.rows[0].crew_id;
    }
    // Stocke le fichier en base64
    const fileBase64 = req.file.buffer.toString('base64');
    const file_name = req.file.originalname;
    const file_url = `data:${req.file.mimetype};base64,${fileBase64}`;
    const now = new Date();
    const result = await pool.query(
      `INSERT INTO documents (crew_id, uploader_id, file_name, file_url, uploaded_at)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [crew_id, uploader_id, file_name, file_url, now]
    );
    res.json({
      id: result.rows[0].id,
      file_name,
      file_url
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Liste les fichiers liés à une annonce (depuis la BDD)
router.get('/list-announcement/:announcementId', async (req, res) => {
  try {
    const { announcementId } = req.params;
    // Récupère crew_id associé à l'annonce
    const ann = await pool.query('SELECT crew_id FROM travel_announcements WHERE id = $1', [announcementId]);
    if (!ann.rows.length) return res.json([]);
    const crew_id = ann.rows[0].crew_id;
    const docs = await pool.query('SELECT id, file_name, file_url FROM documents WHERE crew_id = $1 ORDER BY uploaded_at DESC', [crew_id]);
    res.json(docs.rows.map(f => ({
      id: f.id,
      filename: f.file_name,
      url: f.file_url
    })));
  } catch (err) {
    res.status(500).json({ error: 'Impossible de lire les fichiers.' });
  }
});

// ...garde les autres routes si besoin...

module.exports = router;
