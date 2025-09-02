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

// Sert les fichiers statiques (HTML, JS, CSS, etc.)
app.use(express.static(__dirname));

// Servir les fichiers uploadés
app.use('/uploads', express.static(__dirname + '/Gocrew_backend/uploads'));

// Sert le formulaire principal à la racine
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/test.html');
});

// Sert la page de création d'utilisateur
app.get('/user', (req, res) => {
    res.sendFile(__dirname + '/user.html');
});

// Sert la page d'inscription (register)
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

// Sert la page de profil utilisateur
app.get('/profile', (req, res) => {
    res.sendFile(__dirname + '/user-profile.html');
});

// Gestion des sockets temps réel (chat, notifications, etc.)
io.on('connection', (socket) => {
    console.log('Nouvelle connexion : ' + socket.id);

    socket.on('disconnect', () => {
        console.log('Déconnexion : ' + socket.id);
    });

    // Autres gestionnaires d'événements pour les sockets
});

// Gestion d'erreur 404 pour les routes inconnues
app.use((req, res) => {
    res.status(404).json({ error: "Route non trouvée" });
});

const PORT_BACKEND = process.env.PORT_BACKEND || 3000;
http.listen(PORT_BACKEND, () => console.log(`Serveur lancé sur le port pour le backend ${PORT_BACKEND}`));
