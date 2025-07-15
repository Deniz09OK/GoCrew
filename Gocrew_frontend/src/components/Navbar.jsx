import Workspace from "./icons/Workspace.jsx";
import Person from "./icons/Person.jsx";
import {useContext, useEffect, useRef, useState} from "react";
import NotificationCenter from "./notifications/NotificationCenter.jsx";
import PropTypes from "prop-types";
import useFetchUserData from "../hooks/useFetchUserData.jsx";
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import NotificationManager, {setNotificationManager} from "./notifications/NotificationManager.jsx";
import {MenuContext} from "./MenuContext.jsx";

Navbar.propTypes = {
    selectedWorkspace: PropTypes.object,
    workspaceColor: PropTypes.string,
}

export default function Navbar({ selectedWorkspace, workspaceColor }) {
    const [greeting, setGreeting] = useState("Bonjour");
    const userData = useFetchUserData();
    const navigate = useNavigate();
    const {isMenuOpen} = useContext(MenuContext);
    const notificationManagerRef = useRef(null);


    useEffect(() => {
        if (notificationManagerRef.current) {
            setNotificationManager(notificationManagerRef.current);
        }
    }, []);

    useEffect(() => {
        const currentHour = new Date().getHours();
        if (currentHour < 6 || currentHour >= 18) {
            setGreeting("Bonsoir");
        } else {
            setGreeting("Bonjour");
        }
    }, []);

    const handleLogout = () => {
        Cookies.remove('trello_token');
        navigate('/login');
    };

    const getAvatarUrl = () => {
        if (!userData?.avatarHash) return null;
        return `https://trello-members.s3.amazonaws.com/${userData.id}/${userData.avatarHash}/170.png`;
    };

    const firstName = userData?.fullName?.split(' ')[0];

    return (
        <>
            <div className="flex h-18 lg:w-384 min-md:w-346 min-sm:326 justify-between border-b-2 border-gray-200 dark:border-violet-950 bg-white dark:bg-pureDark dark:text-white duration-1000 content-center z-10 gap-4">
                     {selectedWorkspace && (
                         <div className={`${isMenuOpen ? "left-72": "left-22" } w-20 gap-2 flex items-center relative left-32`}>
                             <Workspace color={workspaceColor} />
                             <span>{selectedWorkspace.name}</span>
                         </div>
                     )}
                <div className="w-20 flex items-center relative left-12 lg:left-254">
                    {userData && <NotificationCenter userId={userData.id}/>}
                    <NotificationManager ref={notificationManagerRef} />
                </div>
                <div className="max-md:invisible max-md:w-0 w-full flex p-2 text-black dark:text-white items-center justify-end gap-4 dark:bg-custom-pureDark">
                    <span>{greeting} {firstName || 'Utilisateur'}</span>
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                        Déconnexion
                    </button>
                </div>
                <div className="p-2 px-6 text-black dark:text-white flex items-center text-xl">
                    {userData?.avatarHash ?(
                        <img 
                            src={getAvatarUrl()}
                            alt="Avatar" 
                            className="max-sm:w-12 w-18 object-fill rounded-full transition-all duration-200 relativemd:left-0 left-24"
                            onError={(e) => {
                                console.error('Erreur de chargement de l\'avatar');
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<svg class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>';
                            }}
                        />
                    ) : (
                        <Person className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                    )}
                </div>
            </div>
        </>
    );
}