import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";

const socket = io("http://localhost:3000"); // backend socket.io

export default function Messages() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on("receive_message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });
        return () => socket.off("receive_message");
    }, []);

    const handleSend = (text) => {
        const msg = { text, time: new Date().toLocaleTimeString(), sender: "me" };
        setMessages((prev) => [...prev, msg]);
        socket.emit("send_message", msg);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 bg-white">
                {messages.map((m, i) => (
                    <MessageBubble
                        key={i}
                        text={m.text}
                        time={m.time}
                        isSender={m.sender === "me"}
                    />
                ))}
            </div>
            <MessageInput onSend={handleSend} />
        </div>
    );
}
