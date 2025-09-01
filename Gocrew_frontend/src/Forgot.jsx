// Importation des hooks React
import { useEffect, useState } from "react";

// Importation de l’image de fond de la section gauche
import backgroundImage from "./assets/background_auth.png";

import { Link, useNavigate } from "react-router-dom";

// Importation de la gestion des cookies (non utilisé ici mais prévu pour future session ?)
import Cookies from "js-cookie";

// Importation des icônes de marque
import BrandWhiteIcon from "./components/icons/BrandWhiteIcon";
import BrandIcon from "./components/icons/BrandIcon"; // Pas utilisé ici

// Importation des icônes pour affichage du mot de passe (non utilisés dans cette page)
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
    // État pour afficher/masquer le mot de passe (non utilisé ici mais probablement copié d’un formulaire de login)
    const [showPassword, setShowPassword] = useState(false);

    // États pour l'email et potentiellement le mot de passe (non utilisé ici)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // pour la navigation
    const navigate = useNavigate();


    return (
        <div className="w-full h-screen flex justify-center bg-white">
            {/* Partie gauche : Image d’illustration + slogan */}
            <div className="w-1/2 h-screen bg-[#FFA325] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center space-y-6 gap-4">
                    <img src={backgroundImage} alt="..." className="w-2/3 h-3/4" />
                    <p className="text-white text-3xl font-extrabold text-center">
                        Votre voyage, pensé pour vous.
                    </p>
                </div>
            </div>

            {/* Partie droite : Formulaire de réinitialisation */}
            <div className="w-1/2 h-screen flex flex-col justify-center items-center gap-4 bg-white">
                {/* Logo de la marque */}
                <div className="inline-flex">
                    <BrandWhiteIcon />
                </div>

                {/* Texte d’introduction */}
                <div className="w-full self-stretch inline-flex flex-col justify-start items-center gap-2">
                    <h1 className="justify-center text-gray-800 text-3xl font-bold font-['Urbanist'] leading-10">
                        Réinitialiser votre mot de passe
                    </h1>
                    <p className="opacity-60 text-center justify-start text-gray-800 text-base font-normal font-['Urbanist'] leading-loose">
                        Veuillez renseignez vos informations pour créer votre compte
                    </p>
                </div>

                {/* Champ email */}
                <div>
                    <div className="flex flex-col items-start relative my-4 w-md">
                        <label htmlFor="email" className="block text-gray-800 text-sm font-semibold">
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

                    {/* Bouton pour envoyer la demande de réinitialisation */}
                    <div className="relative my-4 w-md">
                        <button onClick={() => navigate("/forgot")} className="btn w-full h-10  bg-orange-500 rounded-[400px] text-white hover:bg-orange-600 transition-all hover:-translate-y-1 hover:shadow-lg">
                            Réinitialiser
                        </button>
                    </div>
                </div>

                {/* Bouton de retour à l'accueil */}
                <div>
                    <button
                        onClick={() => navigate("/login")}
                        className="btn text-gray-800 text-sm font-semibold underline"
                    >
                        Retour
                    </button>
                </div>
            </div>
        </div>
    );
}
