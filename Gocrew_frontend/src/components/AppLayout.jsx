import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

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

    const voyages = [
        { id: 'barcelone', name: 'Voyage barcelone', color: 'bg-blue-400' },
        { id: 'espagne', name: 'Voyage Espagne', color: 'bg-red-400' },
        { id: 'italie', name: 'Voyage Italie', color: 'bg-green-400' },
    ];
    return (
        <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
            {/* Barre latérale */}
            <aside
                className={`bg-[#FF9A0F] text-white flex flex-col p-4 flex-shrink-0 transition-all duration-300 ease-in-out
      ${isSidebarOpen ? 'w-96' : ' md:w-24'} 
    `}
            >
                {/* Logo et bouton Tab
                Icon */}
                <div
                    className={`flex items-center mb-12 ${isSidebarOpen ? "justify-between" : "justify-center"
                        }`}
                >
                    {/* Logo visible uniquement si ouvert */}
                    <BrandWhiteIcon
                        className={`${!isSidebarOpen ? "none" : "w-72 h-10"}`}
                    />
                    {!isSidebarOpen &&<img src="/images/LogoGroup.png" alt="" />}

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
                    {/* Section Acceuil */}

                    <NavLink
                        to="/home"
                        className={({ isActive }) =>
                            `flex items-center text-base font-extrabold p-4 mb-6 rounded-full transition-colors ${!isSidebarOpen && 'justify-center py-5'} ${isActive ? 'bg-white text-[#FF6300]' : 'bg-[#E37A3766] text-white'}`
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
                            `flex items-center text-base font-extrabold p-4 mb-3 rounded-full transition-colors ${!isSidebarOpen && 'justify-center py-5'} ${isActive
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
                            `flex items-center text-base font-extrabold p-4 mb-3 rounded-full transition-colors ${!isSidebarOpen && 'justify-center py-5'} ${isActive ? 'bg-white text-[#FF6300]' : 'bg-[#E37A3766] text-white'}`
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
                                    `flex items-center text-base font-extrabold p-4 mr-3 w-full rounded-full transition-colors ${!isSidebarOpen && 'justify-center mr-0 p-5'} ${isActive ? 'bg-white text-[#FF6300]' : 'bg-[#E37A3766] text-white'}`
                                }
                            >
                                <AirPlane />
                                {isSidebarOpen && <span className="ml-4">Voyages</span>}
                            </NavLink>
                            {isSidebarOpen && <Link to="/trips" className="p-1.5 bg-white text-primary rounded-full flex items-center justify-center hover:bg-gray-200 ring-2 ring-secondary">
                                <span className="text-2xl"><Add /></span>
                            </Link>}
                        </div>
                        {isSidebarOpen && <div className="mt-2 ml-8 pl-3 space-y-2 flex flex-col">
                            {voyages.map(voyage => (
                                <div key={voyage.id} className="flex items-center justify-between">
                                    <NavLink
                                        to={`/trips/${voyage.id}`}
                                        className={({ isActive }) =>
                                            `flex items-center py-1 text-white hover:text-gray-200 ${isActive ? "font-bold" : ""
                                            }`
                                        }
                                    >
                                        <span className={`w-2 h-2 rounded-full mr-3 ${voyage.color}`}></span>
                                        {voyage.name}
                                    </NavLink>
                                    <EllipsisVerticalIcon className="text-white cursor-pointer" />
                                </div>
                            ))}
                        </div>}

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
                <header className="bg-white shadow-sm p-4 flex justify-end items-center border-b-1 border-b-gray-300">
                    <div className="flex items-center">
                        <BellDot className='mr-2' />
                        <div className='bg-[#FFA32533] rounded-full w-10 h-10 flex items-center justify-center mr-4'>
                            <PersonIcon />
                        </div>
                        <span className="mr-4 font-medium">John Bigo</span>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#FFA32514] md:p-8 p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
