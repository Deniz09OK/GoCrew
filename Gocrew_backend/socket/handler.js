// Handler pour la gestion des connexions Socket.io
let chatHistoryByCrew = {};
let chatHistoryByAnnouncement = {};

module.exports = (io) => {
    io.on('connection', (socket) => {
        // Rejoint un salon de crew pour le chat privé
        socket.on('join-crew-chat', ({ crewId }) => {
            if (!crewId) return;
            socket.join(`crew-${crewId}`);
            // Envoie l'historique du chat de ce crew
            if (!chatHistoryByCrew[crewId]) chatHistoryByCrew[crewId] = [];
            socket.emit('chat-history', chatHistoryByCrew[crewId].slice(-50));
        });

        // Message dans un crew
        socket.on('chat-message-crew', ({ crewId, text, user }) => {
            if (!crewId || !text) return;
            const now = new Date();
            const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Paris' });
            const message = {
                user: typeof user === 'string' && user.trim() ? user : 'Anonyme',
                text,
                time
            };
            if (!chatHistoryByCrew[crewId]) chatHistoryByCrew[crewId] = [];
            chatHistoryByCrew[crewId].push(message);
            if (chatHistoryByCrew[crewId].length > 100) chatHistoryByCrew[crewId] = chatHistoryByCrew[crewId].slice(-100);
            io.to(`crew-${crewId}`).emit('chat-message', message);
        });

        // Rejoint un salon d'annonce (public)
        socket.on('join-announcement-chat', ({ announcementId }) => {
            if (!announcementId) return;
            socket.join(`announcement-${announcementId}`);
            if (!chatHistoryByAnnouncement[announcementId]) chatHistoryByAnnouncement[announcementId] = [];
            socket.emit('chat-history-announcement', chatHistoryByAnnouncement[announcementId].slice(-50));
        });

        // Message dans une annonce (public)
        socket.on('chat-message-announcement', ({ announcementId, text, user }) => {
            if (!announcementId || !text) return;
            const now = new Date();
            const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Paris' });
            const message = {
                user: typeof user === 'string' && user.trim() ? user : 'Anonyme',
                text,
                time
            };
            if (!chatHistoryByAnnouncement[announcementId]) chatHistoryByAnnouncement[announcementId] = [];
            chatHistoryByAnnouncement[announcementId].push(message);
            if (chatHistoryByAnnouncement[announcementId].length > 100) chatHistoryByAnnouncement[announcementId] = chatHistoryByAnnouncement[announcementId].slice(-100);
            io.to(`announcement-${announcementId}`).emit('chat-message-announcement', message);
        });
    });
};
