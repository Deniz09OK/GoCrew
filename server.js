const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./Gocrew_backend/routes/auth.routes');
const CrewRoutes = require('./Gocrew_backend/routes/CrewRoutes');

// CORS : autorise toutes les origines pour les tests locaux (sécurise en prod !)
app.use(cors({
    origin: '*'
}));

app.use(express.json()); // Middleware pour parser le JSON des requêtes

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/crews', CrewRoutes);

// Sert le formulaire HTML à la racine
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/test.html');
});

// Sert les fichiers statiques (optionnel, utile si tu as d'autres fichiers à servir)
app.use(express.static(__dirname));

// Gestion des sockets temps réel (chat, notifications, etc.)
require('./Gocrew_backend/socket/handler')(io);

const PORT_BACKEND = process.env.PORT_BACKEND || 3000;
http.listen(PORT_BACKEND, () => console.log(`Serveur lancé sur le port pour le backend ${PORT_BACKEND}`));
