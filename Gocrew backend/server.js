const express = require('express');
const db = require('./src/models/db'); // Assurez-vous que le chemin est correct
const app = express();

app.use(express.json());

app.get('/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ success: true, now: result.rows[0].now });
    } catch (err) {
        console.error('Erreur PostgreSQL :', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(3000, () => {
    console.log('✅ Serveur lancé sur http://localhost:3000');
});
