import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import { motion } from "framer-motion";


const socket = io("http://localhost:3000");

export default function Messages() {
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Charger l'historique
        socket.on("chat_history", (history) => {
            setMessages(history);
        });

        // Nouveaux messages en temps réel
        socket.on("receive_message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("chat_history");
            socket.off("receive_message");
        };
    }, []);

    // Scroll auto quand messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (text) => {
        const msg = {
            text,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            sender: "me",
        };
        socket.emit("send_message", msg);
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-[#FFF9F3] to-white">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-white shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800">Messagerie</h2>
                <span className="text-xs text-green-500">● En ligne</span>
            </div>

            {/* Messages list */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-300">
                {messages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-full text-gray-400"
                    >
                        <p className="text-sm">Aucun message pour l’instant 👋</p>
                        <p className="text-xs">Commence la conversation ci-dessous</p>
                    </motion.div>
                ) : (
                    <>
                        {messages.map((m, i) => (
                            <MessageBubble
                                key={i}
                                text={m.text}
                                time={m.time}
                                isSender={m.sender === "me"}
                            />
                        ))}
                        {/* Référence pour scroll auto */}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <MessageInput onSend={handleSend} />
        </div>
    );
}
