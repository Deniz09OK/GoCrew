import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function MessageInput({ onSend }) {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim() !== "") {
            onSend(message);
            setMessage("");
        }
    };

    return (
        <div className="flex items-center border-t p-3 bg-white">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Écrire un message..."
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm 
                           outline-none shadow-sm focus:ring-2 focus:ring-[#FFA325]/50"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                className="ml-2 bg-gradient-to-r from-[#FFA325] to-[#FF7B00] 
                           text-white rounded-full p-3 shadow-md hover:shadow-lg 
                           transition duration-200"
            >
                <Send size={18} />
            </motion.button>
        </div>
    );
}
