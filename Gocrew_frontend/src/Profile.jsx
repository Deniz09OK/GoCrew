import { useEffect, useState } from "react";

export default function User() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Token envoyé :", token); // Ajoute ce log avant le fetch
        if (!token) {
            setError("Veuillez vous connecter.");
            return;
        }
        fetch("http://localhost:3000/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.user) setUser(data.user);
            else setError(data.error || "Erreur serveur");
        })
        .catch(() => setError("Erreur réseau"));
    }, []);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!user) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="mb-4 flex items-center">
            {user.avatar_url ? (
                <img
                    src={user.avatar_url}
                    alt="Avatar"
                    className="inline-block w-10 h-10 rounded-full object-cover mr-3"
                />
            ) : (
                <span className="inline-block w-10 h-10 rounded-full bg-purple-300 text-purple-800 flex items-center justify-center font-bold mr-3">
                    {user.username ? user.username.charAt(0).toUpperCase() : "?"}
                </span>
            )}
            <span className="text-lg font-semibold text-purple-800">
                {user.username || "Utilisateur"}
            </span>
        </div>
    );
}
