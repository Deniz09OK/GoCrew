const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const authRoutes = require('./src/routes/auth.routes');

require('dotenv').config(); // Charge les variables d'environnement depuis .env

const bcrypt = require('bcrypt');
// Génère un hash pour un mot de passe de test (à usage de debug uniquement)
bcrypt.hash('votreMotDePasse', 10);

app.use(express.json()); // Middleware pour parser le JSON des requêtes
app.use('/api/auth', authRoutes); // Routes d'authentification

// Route pour servir la page de connexion
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// Route pour servir la page d'inscription
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

// Route pour servir la page d'accueil après connexion
app.get('/welcome', (req, res) => {
    res.sendFile(__dirname + '/welcome.html');
});

// Gestion des sockets temps réel (chat, notifications, etc.)
require('./src/socket/handler')(io);

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
