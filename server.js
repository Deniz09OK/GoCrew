const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const authRoutes = require('./src/routes/auth.routes');

require('dotenv').config();

const bcrypt = require('bcrypt');
bcrypt.hash('votreMotDePasse', 10);

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

app.get('/welcome', (req, res) => {
    res.sendFile(__dirname + '/welcome.html');
});

require('./src/socket/handler')(io);

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
