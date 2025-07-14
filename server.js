const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const socketHandler = require('./Gocrew_backend/socket/handler');

// Configuration
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', require('./Gocrew_backend/routes'));

// Fichiers statiques (pour le front si nécessaire)
app.use(express.static(path.join(__dirname, 'public'))); // tu peux adapter vers 'frontend/dist' si tu build ton front

// Sockets temps réel (chat, notifications...)
socketHandler(io);

// Lancement du serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
