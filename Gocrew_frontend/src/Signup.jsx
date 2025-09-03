import {useState } from "react";
import backgroundImage from "./assets/background_auth.png";
import { Link, useNavigate } from "react-router-dom";

import Cookies from "js-cookie";
import BrandWhiteIcon from "./components/icons/BrandWhiteIcon";
import BrandIcon from "./components/icons/BrandIcon";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
    // États pour les champs de formulaire et options
    const [showPassword, setShowPassword] = useState(false); // Afficher ou cacher le mot de passe
    const [email, setEmail] = useState("");                  // Email de l'utilisateur
    const [name, setName] = useState("");                    // Nom d'utilisateur
    const [password, setPassword] = useState("");            // Mot de passe
    const [rememberMe, setRememberMe] = useState(false);     // Option "Se souvenir de moi"
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // pour la navigation
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }
        try {
            const res = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, username: name })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess("Inscription réussie ! Connectez-vous.");
                setError("");
                // Optionnel : rediriger automatiquement vers /login
                // navigate("/login");
            } else {
                setError(data.error || "Erreur lors de l'inscription");
            }
        } catch (err) {
            setError("Erreur réseau : " + err.message);
        }
    };

    return (
        <div className="w-full h-screen flex justify-center bg-white">
            {/* --- SECTION GAUCHE : Image illustrative --- */}
            <div className="w-1/2 h-screen bg-[#FFA325] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center space-y-6 gap-4">
                    <img src={backgroundImage} alt="..." className="w-2/3 h-3/4" />
                    <p className="text-white text-3xl font-extrabold text-center">
                        Votre voyage, pensé pour vous.
                    </p>
                </div>
            </div>

            {/* --- SECTION DROITE : Formulaire d'inscription --- */}
            <div className="w-1/2 h-screen flex flex-col justify-center items-center gap-4 bg-white">

                {/* Logo de la marque */}
                <div className="inline-flex">
                    <BrandWhiteIcon />
                </div>

                {/* Titre et sous-titre */}
                <div className="w-full self-stretch inline-flex flex-col justify-start items-center gap-2">
                    <h1 className="justify-center text-gray-800 text-3xl font-bold font-['Urbanist'] leading-10">
                        Inscription
                    </h1>
                    <p className="opacity-60 text-center justify-start text-gray-800 text-base font-normal font-['Urbanist'] leading-loose">
                        Veuillez renseigner vos informations pour créer votre compte
                    </p>
                </div>

                {/* --- CHAMPS DU FORMULAIRE --- */}
                <form onSubmit={handleSubmit}>
                    {/* Champ : Nom d'utilisateur */}
                    <div className="flex flex-col items-start relative my-4 w-md">
                        <label className="block text-gray-800 text-sm font-semibold font-['Urbanist']" htmlFor="name">
                            Nom d’utilisateur
                        </label>
                        <input
                            className="block w-full self-stretch text-gray-800 opacity-100 px-4 py-2.5 bg-orange-100 rounded-[16px] justify-start items-center gap-2.5 border border-gray-100 focus:outline-none focus:border-[#FF6300] transition duration-200 selection:bg-[#FF6300] selection:text-white"
                            type="text"
                            id="name"
                            autoComplete="name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Champ : Email */}
                    <div className="flex flex-col items-start relative my-4 w-md">
                        <label className="block text-gray-800 text-sm font-semibold font-['Urbanist']" htmlFor="email">
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

                    {/* Champ : Mot de passe */}
                    <div className="flex flex-col items-start relative my-4 w-md">
                        <label className="block text-gray-800 text-sm font-semibold font-['Urbanist']" htmlFor="password">
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
                            {/* Icône d'affichage du mot de passe */}
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Champ : Confirmation du mot de passe */}
                    <div className="flex flex-col items-start relative my-4 w-md">
                        <label className="block text-gray-800 text-sm font-semibold font-['Urbanist']">
                            Saisir à nouveau votre mot de passe
                        </label>
                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="****************"
                                className="block w-full self-stretch text-gray-800 opacity-100 px-4 py-2.5 bg-orange-100 rounded-[16px] justify-start items-center gap-2.5 border border-gray-100 focus:outline-none focus:border-[#FF6300] transition duration-200 selection:bg-[#FF6300] selection:text-white"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {/* Icône pour afficher/masquer le mot de passe */}
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm mb-2">{error}</div>
                    )}
                    {success && (
                        <div className="text-green-500 text-sm mb-2">{success}</div>
                    )}
                    {/* Bouton : S'inscrire */}
                    <div className="relative my-4 w-md">
                        <button onClick={() => navigate("/home")} className="w-full h-10 p-3 bg-orange-500 rounded-[400px] inline-flex justify-center items-center text-white hover:bg-orange-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                            S'inscrire
                        </button>
                    </div>
                </form>

                {/* --- AUTRES OPTIONS --- */}
                <div className="relative w-md">
                    {/* Lien : Se connecter */}
                    <button
                        onClick={() => navigate("/login")}
                        className="btn w-full relative overflow-hidden h-4 mt-6 inline-flex justify-center items-center gap-2.5 cursor-pointer text-gray-800 text-sm font-semibold font-['Urbanist'] leading-snug underline"
                    >
                        Se connecter
                    </button>
                </div>
            </div>
        </div>
    );
}
