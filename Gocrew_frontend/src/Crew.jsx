// Ajoute la classe text-black aux éléments pour forcer le texte en noir

import { useState } from "react";

export default function Crew() {
    const [form, setForm] = useState({
        name: "",
        description: "",
        destination: "",
        budget: "",
        start_date: "",
        end_date: "",
        email: "" // Email du créateur
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResult(null);
        try {
            const res = await fetch("http://localhost:3000/api/crews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (!res.ok) {
                let errorMsg = "Erreur lors de la création du crew";
                try {
                    const data = await res.json();
                    errorMsg = data.error || errorMsg;
                } catch (jsonErr) {
                    errorMsg += " (réponse invalide du serveur)";
                }
                setError(errorMsg);
                return;
            }

            const data = await res.json();
            setResult(data);
            setForm({
                name: "",
                description: "",
                destination: "",
                budget: "",
                start_date: "",
                end_date: "",
                email: ""
            });
        } catch (err) {
            setError("Erreur réseau : " + err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
            <h2 className="text-2xl font-bold mb-4 text-black">Créer un Crew</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-96 p-6 border rounded-xl shadow text-black">
                <input name="name" placeholder="Nom du crew" value={form.name} onChange={handleChange} required className="text-black" />
                <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="text-black" />
                <input name="destination" placeholder="Destination" value={form.destination} onChange={handleChange} className="text-black" />
                <input name="budget" type="number" placeholder="Budget" value={form.budget} onChange={handleChange} className="text-black" />
                <input name="start_date" type="date" placeholder="Date début" value={form.start_date} onChange={handleChange} className="text-black" />
                <input name="end_date" type="date" placeholder="Date fin" value={form.end_date} onChange={handleChange} className="text-black" />
                <input name="email" type="email" placeholder="Email du créateur" value={form.email} onChange={handleChange} required className="text-black" />
                <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">Créer</button>
            </form>
            {error && <div className="text-red-500 mt-4 text-black">{error}</div>}
            {result && (
                <div className="mt-4 p-4 border rounded bg-gray-50 text-black">
                    <div className="font-bold text-black">Crew créé :</div>
                    <pre className="text-sm text-gray-800 text-black">{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
