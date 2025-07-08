import { useEffect, useState } from "react";
import backgroundImage from "./assets/background_auth.png";

import Cookies from "js-cookie";
import BrandWhiteIcon from "./components/icons/BrandWhiteIcon";
import BrandIcon from "./components/icons/BrandIcon";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);


    return (


        <div className="w-full h-screen flex justify-center bg-white">

            {/* Authification : Section de gauche pour l'image de connexion */}

            <div className="w-1/2 h-screen bg-[#FFA325] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center space-y-6 gap-4">
                    <img src={backgroundImage} alt="..." className="w-2/3 h-3/4" />
                    <p className="text-white text-3xl font-extrabold text-center">
                        Votre voyage, pensé pour vous.
                    </p>
                </div>
            </div>

            {/* Authification : Section de droite pour le formualaire */}

            <div className="w-1/2 h-screen flex flex-col justify-center items-center gap-4 bg-white">
                <div className="inline-flex">
                    <BrandWhiteIcon />
                </div>
                <div className="w-full self-stretch inline-flex flex-col justify-start items-center gap-2">
                    <h1 className="justify-center text-gray-800 text-3xl font-bold font-['Urbanist'] leading-10">
                        Connexion
                    </h1>
                    <p className="opacity-60 text-center justify-start text-gray-800 text-base font-normal font-['Urbanist'] leading-loose">
                        Veuillez vous connecter pour continuer avec votre compte
                    </p>
                </div>
                <div>
                    <div className="flex flex-col items-start relative my-4 w-md">
                        <label className="block justify-start text-gray-800 text-sm font-semibold font-['Urbanist'] leading-snug" htmlFor="email">Email</label>
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
                    <div className="flex flex-col items-start relative my-4 w-md">
                        <label className="block justify-start text-gray-800 text-sm font-semibold font-['Urbanist'] leading-snug" htmlFor="password">Mot de passe</label>
                        <div className="relative w-full">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="****************"
                                className="block w-full self-stretch text-gray-800 opacity-100 px-4 py-2.5 bg-orange-100 rounded-[16px] justify-start items-center gap-2.5 border border-gray-100 focus:outline-none focus:border-[#FF6300] transition duration-200 selection:bg-[#FF6300] selection:text-white"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col items-start relative my-4 w-md">
                        <div className="inline-flex justify-start items-center gap-2.5">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="rememberMe" className="opacity-90 text-center justify-start text-gray-800 text-base font-normal font-['Urbanist'] leading-snug">Rester connecté</label>
                        </div>
                    </div>
                    <div className="relative my-4 w-md">
                        <button className="btn w-full relative overflow-hidden h-10 p-3 bg-orange-500 rounded-[400px] inline-flex justify-center items-center gap-2.5 text-white cursor-pointer hover:bg-orange-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                            Connexion
                        </button>
                    </div>
                </div>
                <div>
                    <span className="block justify-start text-gray-800 text-sm font-semibold font-['Urbanist'] leading-snug underline">Mot de passe oublié ?</span>
                </div>
            </div>

        </div>
    );
}