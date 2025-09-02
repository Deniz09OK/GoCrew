import React, { useEffect, useState } from "react";
import UserProfile from "../components/UserProfile";

export default function UserPage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        fetch("http://localhost:3000/api/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => setUser(data))
            .catch(() => setUser(null));
    }, []);

    if (!user) return <div>Chargement du profil...</div>;

    return <UserProfile user={user} />;
}
