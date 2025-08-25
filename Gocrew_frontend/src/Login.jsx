import {useState } from "react";
import backgroundImage from "./assets/background_auth.png";
import { Link, useNavigate } from "react-router-dom";

import BrandWhiteIcon from "./components/icons/BrandWhiteIcon"; // icône de marque (blanche)
import { Eye, EyeOff } from "lucide-react"; // icônes pour afficher/masquer le mot de passe

export default function Login() {
    // état pour afficher ou masquer le mot de passe
    const [showPassword, setShowPassword] = useState(false);

    // état pour stocker l'email entré
    const [email, setEmail] = useState("");

    // état pour stocker le mot de passe entré
    const [password, setPassword] = useState("");

    // état pour savoir si l'utilisateur veut rester connecté
    const [rememberMe, setRememberMe] = useState(false);

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
            if (res.ok && data.token) {
                localStorage.setItem("token", data.token); // Stocke le token
                alert(`Votre ID utilisateur : ${data.user?.id}`);
                navigate("/homeprivate");
            } else {
                setError(data.error || "Erreur de connexion");
            }
        } catch (err) {
            setError("Erreur réseau : " + err.message);
        }
    };

    const token = localStorage.getItem("token");
    console.log("Token envoyé :", token);
    fetch("http://localhost:3000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
    })

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
                    <BrandWhiteIcon />
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

                        {/* Case à cocher "Rester connecté" */}
                        <div className="flex flex-col items-start relative my-4 w-md">
                            <div className="inline-flex justify-start items-center gap-2.5">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="rememberMe" className="opacity-90 text-center justify-start text-gray-800 text-base font-normal font-['Urbanist'] leading-snug">
                                    Rester connecté
                                </label>
                            </div>
                        </div>

                        {/* Bouton de connexion */}
                        <div className="relative my-4 w-md">
                            <button type="submit" className="btn w-full relative overflow-hidden h-10 p-3 bg-orange-500 rounded-[400px] inline-flex justify-center items-center gap-2.5 text-white cursor-pointer hover:bg-orange-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                Connexion
                            </button>
                        </div>

                        {/* Message d'erreur */}
                        {error && (
                            <div className="text-red-500 text-sm mb-2">{error}</div>
                        )}
                    </form>
                </div>

                {/* Lien mot de passe oublié */}
                <div>
                    <button
                        onClick={() => navigate("/forgot")}
                        className="btn w-full relative overflow-hidden h-4 inline-flex justify-center items-center gap-2.5 cursor-pointer text-gray-800 text-sm font-semibold font-['Urbanist'] leading-snug underline"
                    >
                        Mot de passe oublié ?
                    </button>
                </div>

                {/* Ligne de séparation avec "ou" */}
                <div className="relative w-md">
                    <div className="flex items-center justify-center my-4">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-gray-500">ou</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* Bouton Google Authentification */}
                    <button
                        onClick
                        className="btn w-full relative overflow-hidden h-10 p-3 bg-white rounded-[400px] border border-gray-300 inline-flex justify-center items-center gap-2.5 text-gray-800 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                        {/* Icône Google */}
                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* chemin SVG de l'icône Google */}
                            {/* ... contenu de l'icône ... */}
                            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_141_213)">
                                    <path d="M4.43242 12.5863L3.73625 15.1852L1.19176 15.239C0.431328 13.8286 0 12.2148 0 10.5C0 8.84176 0.403281 7.27801 1.11812 5.90109H1.11867L3.38398 6.31641L4.37633 8.56813C4.16863 9.17363 4.05543 9.82363 4.05543 10.5C4.05551 11.2341 4.18848 11.9374 4.43242 12.5863Z" fill="#FBBB00" />
                                    <path d="M19.8252 8.63187C19.94 9.2368 19.9999 9.86152 19.9999 10.5C19.9999 11.2159 19.9246 11.9143 19.7812 12.5879C19.2944 14.8802 18.0224 16.8819 16.2604 18.2984L16.2598 18.2978L13.4065 18.1522L13.0027 15.6313C14.1719 14.9456 15.0857 13.8725 15.567 12.5879H10.2197V8.63187H19.8252Z" fill="#518EF8" />
                                    <path d="M16.26 18.2978L16.2606 18.2984C14.5469 19.6758 12.3699 20.5 10.0001 20.5C6.19189 20.5 2.88092 18.3714 1.19189 15.239L4.43256 12.5863C5.27705 14.8401 7.45123 16.4445 10.0001 16.4445C11.0957 16.4445 12.1221 16.1484 13.0029 15.6313L16.26 18.2978Z" fill="#28B446" />
                                    <path d="M16.383 2.80219L13.1434 5.45437C12.2319 4.88461 11.1544 4.55547 10 4.55547C7.39344 4.55547 5.17859 6.23348 4.37641 8.56812L1.11871 5.90109H1.11816C2.78246 2.6923 6.1352 0.5 10 0.5C12.4264 0.5 14.6511 1.3643 16.383 2.80219Z" fill="#F14336" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_141_213">
                                        <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
                                    </clipPath>
                                </defs>
                            </svg>

                        </svg>
                        Google authentification
                    </button>

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
    );
}