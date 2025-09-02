import * as framerMotion from "framer-motion";
import { User, Mail, Calendar } from "lucide-react";

export default function UserProfile({ user }) {
    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-[#FFF9F3] to-white p-6">
            {/* Titre */}
            <framerMotion.motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-gray-800 mb-6"
            >
                Mon Profil
            </framerMotion.motion.h2>

            {/* Carte utilisateur */}
            <framerMotion.motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-md w-full mx-auto"
            >
                <div className="shadow-md rounded-2xl border bg-white">
                    <div className="p-6 space-y-4">
                        {/* Avatar */}
                        <div className="flex justify-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-400 to-yellow-400 flex items-center justify-center text-white text-4xl font-bold shadow">
                                {user.username ? user.username.charAt(0).toUpperCase() : "?"}
                            </div>
                        </div>

                        {/* Infos utilisateur */}
                        <div className="space-y-2 text-center">
                            <h3 className="text-xl font-semibold text-gray-800">{user.username}</h3>
                            <p className="text-gray-500 text-sm">{user.role || "Utilisateur"}</p>
                        </div>

                        {/* Détails */}
                        <div className="space-y-3">
                            <div className="flex items-center text-gray-700">
                                <User className="w-5 h-5 mr-2 text-gray-500" />
                                <span>{user.username}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Mail className="w-5 h-5 mr-2 text-gray-500" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                                <span>
                                    Membre depuis{" "}
                                    {user.created_at
                                        ? new Date(user.created_at).toLocaleDateString()
                                        : "date inconnue"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </framerMotion.motion.div>
        </div>
    );
}
