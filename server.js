const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const authRoutes = require('./Gocrew_backend/src/routes/auth.routes');
const cors = require('cors'); 
require('dotenv').config(); // Charge les variables d'environnement depuis .env

const bcrypt = require('bcrypt');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json()); // Middleware pour parser le JSON des requêtes
app.use('/api/auth', authRoutes); // Routes d'authentification

// Sert les fichiers statiques (HTML, JS, CSS) pour compatibilité front
app.use(express.static(__dirname));

// Gestion des sockets temps réel (chat, notifications, etc.)
require('./Gocrew_backend/src/socket/handler')(io);

const PORT_BACKEND = process.env.PORT_BACKEND || 3000;
http.listen(PORT_BACKEND, () => console.log(`Serveur lancé sur le port pour le backend ${PORT_BACKEND}`));
