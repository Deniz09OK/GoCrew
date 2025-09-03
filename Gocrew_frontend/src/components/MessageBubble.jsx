import { motion } from "framer-motion";

/**
 * Affiche une bulle de message avec un texte, username et un timestamp.
 * Utilise framer-motion pour un léger effet d'apparition.
 *
 * @param {object} props
 * @param {string} props.text - Le contenu du message
 * @param {string} props.time - L'heure d'envoi du message
 * @param {string} props.username - Le nom de l'utilisateur qui a envoyé le message
 * @param {boolean} props.isSender - Indique si le message a été envoyé par l'utilisateur courant
 */
export default function MessageBubble({ text, time, username, isSender }) {
    return (
        <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-4`}>
            <div className={`flex flex-col ${isSender ? "items-end" : "items-start"} max-w-[70%]`}>
                {/* Username (seulement pour les messages reçus) */}
                {!isSender && (
                    <span className="text-xs text-gray-500 mb-1 ml-3">
                        {username || "Utilisateur anonyme"}
                    </span>
                )}
                
                <div
                    className={`
                        p-3 rounded-2xl shadow-md text-sm relative
                        ${isSender
                            ? "bg-gradient-to-r from-[#FFA325] to-[#FF7B00] text-white rounded-br-sm"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-bl-sm"}
                    `}
                >
                    <p className="leading-snug">{text}</p>
                    <span className="block text-[11px] text-gray-200 mt-1 text-right italic">
                        {time}
                    </span>
                </div>
            </div>
        </div>
    );
}
