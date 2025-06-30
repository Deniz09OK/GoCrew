const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const authRoutes = require('./src/routes/auth.routes');

require('dotenv').config();

app.use(express.json());
app.use('/api/auth', authRoutes);

// Socket handler
require('./src/socket/handler')(io);

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
