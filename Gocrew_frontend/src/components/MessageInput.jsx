import { useState } from "react";

export default function MessageInput({ onSend }) {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim() !== "") {
            onSend(message);
            setMessage("");
        }
    };

    return (
        <div className="flex items-center border-t p-3">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Écrire un message..."
                className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
            />
            <button
                onClick={handleSend}
                className="ml-2 bg-[#FFA325] text-white rounded-full p-2"
            >
                ➤
            </button>
        </div>
    );
}
