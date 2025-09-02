import { motion } from "framer-motion";

export default function MessageBubble({ text, time, isSender }) {
    return (
        <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-3`}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`
                    max-w-[70%] p-3 rounded-2xl shadow-md text-sm 
                    ${isSender 
                        ? "bg-gradient-to-r from-[#FFA325] to-[#FF7B00] text-white rounded-br-none" 
                        : "bg-gray-100 text-gray-800 rounded-bl-none"}
                `}
            >
                <p className="leading-snug">{text}</p>
                <span className="block text-[11px] text-gray-400 mt-1 text-right italic">
                    {time}
                </span>
            </motion.div>
        </div>
    );
}
