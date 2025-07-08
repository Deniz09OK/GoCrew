// Handler pour la gestion des connexions Socket.io
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Un utilisateur est connecté via Socket.io');
        // Ici tu peux gérer les événements personnalisés du chat, etc.
    });
};
