module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Un utilisateur est connecté via Socket.io');
      
    });
};
