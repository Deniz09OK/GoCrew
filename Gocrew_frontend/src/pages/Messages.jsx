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
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);

    // Récupérer les informations de l'utilisateur connecté
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:3000/api/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data) {
                        setCurrentUser(data);
                        console.log("👤 Utilisateur connecté:", data);
                    }
                })
                .catch(err => console.error("❌ Erreur lors de la récupération de l'utilisateur:", err));
        }
    }, []);

    useEffect(() => {
        console.log("🔄 Initialisation Socket.IO...");
        
        // Fonction pour éviter les doublons de messages
        const handleChatHistory = (history) => {
            console.log("📜 Historique reçu:", history);
            setMessages(history || []);
        };
        
        const handleReceiveMessage = (msg) => {
            console.log("📨 Message reçu:", msg);
            setMessages((prev) => {
                // Vérifier si le message existe déjà pour éviter les doublons
                const exists = prev.some(existingMsg => 
                    existingMsg.text === msg.text && 
                    existingMsg.time === msg.time && 
                    existingMsg.username === msg.username
                );
                
                if (exists) {
                    console.log("⚠️ Message déjà existant, ignoré");
                    return prev;
                }
                
                return [...prev, msg];
            });
        };
        
        const handleConnect = () => {
            console.log("✅ Connecté au serveur Socket.IO avec l'ID:", socket.id);
        };
        
        const handleDisconnect = (reason) => {
            console.log("❌ Déconnecté du serveur Socket.IO. Raison:", reason);
        };
        
        const handleConnectError = (error) => {
            console.error("🚨 Erreur de connexion Socket.IO:", error);
        };
        
        // Nettoyer les anciens listeners avant d'ajouter les nouveaux
        socket.off("connect");
        socket.off("disconnect"); 
        socket.off("connect_error");
        socket.off("chat_history");
        socket.off("receive_message");
        
        // Ajouter les nouveaux listeners
        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectError);
        socket.on("chat_history", handleChatHistory);
        socket.on("receive_message", handleReceiveMessage);
        
        // Test de connexion au montage
        if (socket.connected) {
            console.log("🟢 Socket déjà connecté");
        } else {
            console.log("🔴 Socket en cours de connexion...");
        }
        
        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectError);
            socket.off("chat_history", handleChatHistory);
            socket.off("receive_message", handleReceiveMessage);
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (text) => {
        if (!currentUser) {
            console.error("❌ Utilisateur non connecté");
            return;
        }
        
        const msg = {
            text,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            sender: "me",
            username: currentUser.name || currentUser.email || "Moi",
            userId: currentUser.id
        };
        console.log("📤 Envoi du message:", msg);
        
        // On n'ajoute PAS le message localement, on laisse le serveur nous le renvoyer
        // setMessages((prev) => [...prev, msg]);
        
        socket.emit("send_message", msg);
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-[#FFF9F3] to-white">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-white shadow-sm">
                <div className="flex flex-col">
                    <h2 className="text-lg font-semibold text-gray-800">Messagerie</h2>
                    {currentUser && (
                        <p className="text-xs text-gray-500">
                            Connecté en tant que {currentUser.name || currentUser.email}
                        </p>
                    )}
                </div>
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
                                text={m.text}
                                time={m.time}
                                username={m.username || "Utilisateur anonyme"}
                                isSender={currentUser && (m.userId === currentUser.id || m.sender === "me")}
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