import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// Tableau qui garde l'historique des messages
let messages = [];

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

server.listen(4000, () => {
    console.log("🚀 Serveur socket.io sur http://localhost:3000");
});
