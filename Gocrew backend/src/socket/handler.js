module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Nouvelle connexion socket établie');

        socket.on('message', (data) => {
            console.log('Message reçu :', data);
            io.emit('message', data); // Réémet à tous les clients
        });

        socket.on('disconnect', () => {
            console.log('Utilisateur déconnecté');
        });
    });
};
