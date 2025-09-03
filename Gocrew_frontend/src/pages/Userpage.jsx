import React, { useEffect, useState } from "react";
import UserProfile from "../components/UserProfile";

export default function UserPage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        const baseUrl =
            typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL
                ? import.meta.env.VITE_API_URL
                : "http://localhost:3000";
        fetch(`${baseUrl}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => setUser(data))
            .catch(() => setUser(null));
    }, []);

    if (!user) return <div>Chargement du profil...</div>;
    return <UserProfile user={user} />;
}
