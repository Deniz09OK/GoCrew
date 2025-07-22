const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors'); 
require('dotenv').config(); // Charge les variables d'environnement depuis .env

const bcrypt = require('bcrypt');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json()); // Middleware pour parser le JSON des requêtes

// Brancher toutes les routes API (y compris /auth, /create-crew, etc.)
app.use('/api', require('./Gocrew_backend/routes/index'));

// Sert les fichiers statiques (HTML, JS, CSS) pour compatibilité front
app.use(express.static(__dirname));

// Sert le Kanban pour /crew/:id
app.get('/crew/:id', (req, res) => {
    res.sendFile(__dirname + '/Gocrew_backend/crew-kanban.html');
});

// Sert welcome.html à la racine
app.get('/welcome.html', (req, res) => {
    res.sendFile(__dirname + '/Gocrew_backend/welcome.html');
});

// Sert la page de connexion
app.get('/login.html', (req, res) => {
    res.sendFile(__dirname + '/Gocrew_backend/login.html');
});

// Sert la page d'inscription
app.get('/register.html', (req, res) => {
    res.sendFile(__dirname + '/Gocrew_backend/register.html');
});

// Sert la page d'annonce pour /announcement/:id
app.get('/announcement/:id', (req, res) => {
    res.sendFile(__dirname + '/Gocrew_backend/announcement.html');
});

// Gestion des sockets temps réel (chat, notifications, etc.)
require('./Gocrew_backend/socket/handler')(io);

// Sert les fichiers uploadés pour accès direct depuis le front
app.use('/uploads', express.static(__dirname + '/Gocrew_backend/uploads'));

const PORT_BACKEND = process.env.PORT_BACKEND || 3000;
http.listen(PORT_BACKEND, () => console.log(`Serveur lancé sur le port pour le backend ${PORT_BACKEND}`));
