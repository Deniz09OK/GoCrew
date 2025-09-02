import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("✅ Un utilisateur connecté");

        socket.on("send_message", (msg) => {
            console.log("Message reçu:", msg);
            io.emit("receive_message", msg); // diffuse à tous
        });

        socket.on("disconnect", () => {
            console.log("❌ Utilisateur déconnecté");
        });
    });
};

server.listen(4000, () => {
    console.log("🚀 Serveur socket.io sur http://localhost:3000");
});
