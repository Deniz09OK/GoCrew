import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";

// Configuration Socket.IO - connexion directe au backend local
const socket = io("http://localhost:3000", {
    transports: ['websocket', 'polling'],
    timeout: 20000,
    forceNew: true
});

export default function Messages() {
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        console.log("🔄 Initialisation Socket.IO...");
        
        socket.on("connect", () => {
            console.log("✅ Connecté au serveur Socket.IO avec l'ID:", socket.id);
        });
        
        socket.on("disconnect", (reason) => {
            console.log("❌ Déconnecté du serveur Socket.IO. Raison:", reason);
        });
        
        socket.on("connect_error", (error) => {
            console.error("🚨 Erreur de connexion Socket.IO:", error);
        });
        
        socket.on("chat_history", (history) => {
            console.log("📜 Historique reçu:", history);
            setMessages(history || []);
        });
        
        socket.on("receive_message", (msg) => {
            console.log("📨 Message reçu:", msg);
            setMessages((prev) => [...prev, msg]);
        });
        
        // Test de connexion au montage
        if (socket.connected) {
            console.log("🟢 Socket déjà connecté");
        } else {
            console.log("🔴 Socket en cours de connexion...");
        }
        
        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("connect_error");
            socket.off("chat_history");
            socket.off("receive_message");
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (text) => {
        const msg = {
            text,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            sender: "me",
        };
        console.log("📤 Envoi du message:", msg);
        setMessages((prev) => [...prev, msg]);
        socket.emit("send_message", msg);
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-[#FFF9F3] to-white">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-white shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800">Messagerie</h2>
                <span className={`text-xs ${socket.connected ? 'text-green-500' : 'text-red-500'}`}>
                    ● {socket.connected ? 'En ligne' : 'Hors ligne'}
                </span>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-300">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <p className="text-sm">Aucun message pour l'instant 👋</p>
                        <p className="text-xs">Commence la conversation ci-dessous</p>
                    </div>
                ) : (
                    <>
                        {messages.map((m, i) => (
                            <MessageBubble
                                key={i}
                                message={m.text}
                                time={m.time}
                                isOwnMessage={m.sender === "me"}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>
            <div className="px-4 py-3 bg-white border-t">
                <MessageInput onSend={handleSend} />
            </div>
        </div>
    );
}