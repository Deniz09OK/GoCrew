import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full bg-[#FFA325] text-white z-50 shadow">
            <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
                {/* Logo */}
                <div className="">
                    <img src="/images/LogoWhite.png" alt="" />
                </div>

                {/* Bouton burger (mobile) */}
                <button
                    className="md:hidden text-white text-3xl"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Menu/>
                </button>

               <div className="flex items-center justify-end">
                 {/* Navigation (desktop) */}
                <nav className="hidden md:flex gap-8 mr-4">
                    <a href="#" className="font-bold hover:underline">
                        Accueil
                    </a>
                    <a href="#services" className="font-bold hover:underline">
                        Nos services
                    </a>
                    <a href="#announcement" className="font-bold hover:underline">
                        Nos annonces
                    </a>
                </nav>

                {/* Actions */}
                <div className="hidden md:flex gap-3">
                    <NavLink to="/signup" className="border border-white px-6 py-2 rounded-full font-bold hover:bg-white hover:text-[#FF6300] transition">
                        S’inscrire
                    </NavLink>
                    <NavLink to="login" className="bg-[#FF6300] px-6 py-2 rounded-full font-bold shadow">
                        Se connecter
                    </NavLink>
                </div>
               </div>
            </div>

            {/* Menu mobile (affiché si isOpen=true) */}
            {isOpen && (
                <div className="md:hidden bg-[#FFA325] px-6 pb-4 flex flex-col gap-4">
                    <NavLink to="/home" className="font-bold hover:underline">
                        Accueil
                    </NavLink>
                    <NavLink to="/services" className="font-bold hover:underline">
                        Nos services
                    </NavLink>
                    <NavLink to="/announcment" className="font-bold hover:underline">
                        Nos annonces
                    </NavLink>
                    <div className="flex flex-col gap-2 mt-4">
                        <button className="border border-white px-6 py-2 rounded-full font-bold hover:bg-white hover:text-[#FF6300] transition">
                            S’inscrire
                        </button>
                        <button className="bg-[#FF6300] px-6 py-2 rounded-full font-bold shadow">
                            Se connecter
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
