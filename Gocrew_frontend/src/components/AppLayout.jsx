import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

// Importation des icônes existantes
import Home from './icons/Home';
// // Importation des icônes existantes
// import Home from './components/icons/Home';
import BrandWhiteIcon from "./icons/BrandWhiteIcon"; // icône de marque (blanche)
import TabIcon from './icons/TabIcon';
import Messages from './icons/MessagesIcon';
import AirPlane from './icons/AirplaneIcon';
import MenuBoard from './icons/MenuBoardIcon';
import Logout from './icons/LogoutIcon';
import PersonIcon from './icons/PersonIcon';
import NotificationIcon from './icons/NotificationIcon';
import { BellDot, EllipsisVerticalIcon } from 'lucide-react';
import Add from './icons/AddIcon';

export default function AppLayout() {
    const [isVoyagesOpen, setIsVoyagesOpen] = useState(true); // Default to open as per screenshot
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for the main sidebar

    // Ajoute un state pour l'utilisateur réel
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            return;
        }
        fetch("http://localhost:3000/api/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => setUser(data))
            .catch(() => setUser(null));
    }, []);         

    // Simuler un utilisateur connecté (à remplacer par vos données utilisateur réelles)
    // const user = {
    //     name: "Anne-cha"
    // };

    // Affichage d'un loader si user non chargé
    if (!user) {
        return <div>Chargement du profil utilisateur...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
            {/* Barre latérale */}
            <aside
                className={`bg-[#FF9A0F] text-white flex flex-col p-4 flex-shrink-0 transition-all duration-300 ease-in-out
    ${isSidebarOpen ? 'w-96' : 'md:w-24'} 
    `}
            >
                {/* Logo et bouton Tab Icon */}
                <div
                    className={`flex items-center mb-12 ${isSidebarOpen ? "justify-between" : "justify-center"
                        }`}
                >
                    {/* Logo visible uniquement si ouvert */}
                    <BrandWhiteIcon
                        className={`${!isSidebarOpen ? "hidden" : "w-72 h-10"}`}
                    />
                    {!isSidebarOpen && <img src="/images/LogoGroup.png" alt="" />}

                    {/* Bouton toggle toujours visible */}
                    <div
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="flex items-center bg-white rounded-xl w-10 h-10 p-2.5 ml-0.5 cursor-pointer"
                    >
                        <TabIcon />
                    </div>
                </div>

                {/* Menu principal */}
                <nav className="flex flex-col space-y-3">
                    {/* Section Accueil */}
                    <NavLink
                        to="/home"
                        className={({ isActive }) =>
                            `flex items-center text-base font-extrabold p-4 mb-6 rounded-full transition-colors ${!isSidebarOpen ? 'justify-center py-5' : ''} ${isActive ? 'bg-white text-[#FF6300]' : 'bg-[#E37A3766] text-white'}`
                        }
                    >
                        <Home className="w-6 h-6" />
                        {isSidebarOpen && <span className="ml-4 text-lg">Accueil</span>}
                    </NavLink>
                    <hr className='bg-[#FFCB8E] border-1 rounded-full mb-10' />
                    {/* Section Messagerie  */}
                    <NavLink
                        to="/messages"
                        className={({ isActive }) =>
                            `flex items-center text-base font-extrabold p-4 mb-3 rounded-full transition-colors ${!isSidebarOpen ? 'justify-center py-5' : ''} ${isActive
                                ? "bg-white text-[#FF6300]"
                                : "bg-[#E37A3766] text-white"
                            }`
                        }
                    >
                        <Messages className="w-5 h-5" />
                        {isSidebarOpen && <span className="ml-4">Messagerie</span>}
                    </NavLink>
                    {/* Section Annonces  */}
                    <NavLink
                        to="/announcements"
                        className={({ isActive }) =>
                            `flex items-center text-base font-extrabold p-4 mb-3 rounded-full transition-colors ${!isSidebarOpen ? 'justify-center py-5' : ''} ${isActive ? 'bg-white text-[#FF6300]' : 'bg-[#E37A3766] text-white'}`
                        }
                    >
                        <MenuBoard />
                        {isSidebarOpen && <span className="ml-4">Annonces</span>}
                    </NavLink>
                    {/* Section Voyages avec sous-menu */}
                    <div>
                        <div
                            className={`flex items-center mb-3 rounded-lg transition-colors cursor-pointer ${window.location.pathname.startsWith('/voyages') ? 'bg-white text-primary' : 'hover:bg-secondary'}`}
                        >
                            <NavLink
                                to="/trips"
                                className={({ isActive }) =>
                                    `flex items-center text-base font-extrabold p-4 mr-3 w-full rounded-full transition-colors ${!isSidebarOpen ? 'justify-center mr-0 p-5' : ''} ${isActive ? 'bg-white text-[#FF6300]' : 'bg-[#E37A3766] text-white'}`
                                }
                            >
                                <AirPlane />
                                {isSidebarOpen && <span className="ml-4">Voyages</span>}
                            </NavLink>
                        </div>

                    </div>
                </nav>
                <div className="mt-auto">
                    <hr className='bg-[#FFCB8E] border-1 rounded-full mb-6' />

                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            `flex items-center text-base font-extrabold p-4 mb-3 rounded-full transition-colors ${isActive ? 'bg-white text-[#FF6300]' : 'bg-[#E37A3766] text-white'}`
                        }
                    >
                        <Logout />
                        {isSidebarOpen && <span className="ml-4">Déconnexion</span>}
                    </NavLink>
                </div>
            </aside>

            {/* Contenu Principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header
                    className="bg-white/90 shadow-lg p-4 flex justify-end items-center border-b border-orange-100 sticky top-0 z-20"
                    style={{
                        backdropFilter: "blur(4px)",
                        WebkitBackdropFilter: "blur(4px)",
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="bg-gradient-to-tr from-[#FFA325] to-[#FFCB8E] rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-2 border-white hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => navigate("/profil")}
                            title="Voir mon profil"
                        >
                            <PersonIcon className="w-7 h-7 text-white" />
                        </div>
                        <span className="font-bold text-[#FF6300] text-lg drop-shadow-sm">{user.username}</span>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#FFA32514] md:p-8 p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
