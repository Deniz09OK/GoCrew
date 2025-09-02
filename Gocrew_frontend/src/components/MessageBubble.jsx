import { motion } from "framer-motion";

/**
 * Affiche une bulle de message avec un texte et un timestamp.
 * Utilise framer-motion pour un léger effet d'apparition.
 *
 * @param {object} props
 * @param {string} props.text - Le contenu du message
 * @param {string} props.time - L'heure d'envoi du message
 * @param {boolean} props.isSender - Indique si le message a été envoyé par l'utilisateur courant
 */
export default function MessageBubble({ text, time, isSender }) {
    return (
        <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-3`}>
            <div
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
            </div>
        </div>
    );
}
