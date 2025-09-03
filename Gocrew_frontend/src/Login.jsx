import {useState } from "react";
import backgroundImage from "./assets/background_auth.png";
import { Link, useNavigate } from "react-router-dom";

import Cookies from "js-cookie"; // pour manipuler les cookies (non utilisé ici)
import BrandWhiteIcon from "./components/icons/BrandWhiteIcon"; // icône de marque (blanche)
import BrandIcon from "./components/icons/BrandIcon"; // icône alternative (non utilisée ici)
import { Eye, EyeOff } from "lucide-react"; // icônes pour afficher/masquer le mot de passe

export default function Login() {
    // état pour afficher ou masquer le mot de passe
    const [showPassword, setShowPassword] = useState(false);

    // état pour stocker l'email entré
    const [email, setEmail] = useState("");

    // état pour stocker le mot de passe entré
    const [password, setPassword] = useState("");

    // pour la navigation
    const navigate = useNavigate();
    const [error, setError] = useState(""); // Ajout état pour afficher l'erreur

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                // Stocke le token dans localStorage ou cookies
                localStorage.setItem("token", data.token);
                // Redirige vers la page d'accueil ou dashboard
                navigate("/home");
            } else {
                setError(data.error || "Erreur de connexion");
            }
        } catch (err) {
            setError("Erreur réseau : " + err.message);
        }
    };

    return (
        // Conteneur principal qui divise l'écran en deux parties
        <div className="w-full h-screen flex justify-center bg-white">

            {/* SECTION GAUCHE : Image et message de bienvenue */}
            <div className="w-1/2 h-screen bg-[#FFA325] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center space-y-6 gap-4">
                    {/* Image de fond d'authentification */}
                    <img src={backgroundImage} alt="..." className="w-2/3 h-3/4" />

                    {/* Slogan */}
                    <p className="text-white text-3xl font-extrabold text-center">
                        Votre voyage, pensé pour vous.
                    </p>
                </div>
            </div>

            {/* SECTION DROITE : Formulaire de connexion */}
            <div className="w-1/2 h-screen flex flex-col justify-center items-center gap-4 bg-white">
                {/* Logo ou icône de marque */}
                <div className="inline-flex">
                    <BrandWhiteIcon className="w-80 h-20" />
                </div>

                {/* Titre et sous-titre */}
                <div className="w-full self-stretch inline-flex flex-col justify-start items-center gap-2">
                    <h1 className="justify-center text-gray-800 text-3xl font-bold font-['Urbanist'] leading-10">
                        Connexion
                    </h1>
                    <p className="opacity-60 text-center justify-start text-gray-800 text-base font-normal font-['Urbanist'] leading-loose">
                        Veuillez vous connecter pour continuer avec votre compte
                    </p>
                </div>

                {/* FORMULAIRE */}
                <div>
                    {/* Affichage des erreurs */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                    
                <form onSubmit={handleSubmit}>
                    {/* Champ email */}
                    <div className="flex flex-col items-start relative my-4 w-md">
                        <label className="block justify-start text-gray-800 text-sm font-semibold font-['Urbanist'] leading-snug" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="block w-full self-stretch text-gray-800 opacity-100 px-4 py-2.5 bg-orange-100 rounded-[16px] justify-start items-center gap-2.5 border border-gray-100 focus:outline-none focus:border-[#FF6300] transition duration-200 selection:bg-[#FF6300] selection:text-white"
                            type="email"
                            id="email"
                            autoComplete="email"
                            placeholder="user@domaine.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Champ mot de passe avec bouton d'affichage */}
                    <div className="flex flex-col items-start relative my-4 w-md">
                        <label className="block justify-start text-gray-800 text-sm font-semibold font-['Urbanist'] leading-snug" htmlFor="password">
                            Mot de passe
                        </label>
                        <div className="relative w-full">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="****************"
                                className="block w-full self-stretch text-gray-800 opacity-100 px-4 py-2.5 bg-orange-100 rounded-[16px] justify-start items-center gap-2.5 border border-gray-100 focus:outline-none focus:border-[#FF6300] transition duration-200 selection:bg-[#FF6300] selection:text-white"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {/* Icône d'œil pour afficher/masquer le mot de passe */}
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Bouton de connexion */}
                    <div className="relative my-4 w-md">
                        <button type="submit" className="btn w-full relative overflow-hidden h-10 p-3 bg-orange-500 rounded-[400px] inline-flex justify-center items-center gap-2.5 text-white cursor-pointer hover:bg-orange-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                            Connexion
                        </button>
                    </div>
                </form>

                {/* Ligne de séparation avec "ou" */}
                <div className="relative w-md">
                    <div className="flex items-center justify-center my-4">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-gray-500">ou</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* Lien pour créer un nouveau compte */}
                    <button
                        onClick={() => navigate("/signup")}
                        className="btn w-full relative overflow-hidden h-4 mt-6 inline-flex justify-center items-center gap-2.5 cursor-pointer text-gray-800 text-sm font-semibold font-['Urbanist'] leading-snug underline"
                    >
                        Créer un nouveau compte
                    </button>
                </div>
            </div>
        </div>
    </div>
    );
}
