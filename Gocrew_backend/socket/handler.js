// Tableau qui garde l'historique des messages
let messages = [];

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("✅ Un utilisateur connecté");

        // Envoi de l'historique au nouvel utilisateur
        socket.emit("chat_history", messages);

        // Réception d'un message
        socket.on("send_message", (msg) => {
            console.log("Message reçu:", msg);

            // Sauvegarde du message dans l'historique
            messages.push(msg);

            // Diffuse le message à tout le monde
            io.emit("receive_message", msg);
        });

        socket.on("disconnect", () => {
            console.log("❌ Utilisateur déconnecté");
        });
    });
};
