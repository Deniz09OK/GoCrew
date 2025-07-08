import ToggleMenu from "./icons/ToggleMenu.jsx";
import BrandIcon from "./icons/BrandIcon.jsx";
import Home from "./icons/Home.jsx";
import Suitcase from "./icons/Suitcase.jsx";
import ToggleOnDarkMode from "./icons/ToggleOnDarkMode.jsx";
import Cookies from 'js-cookie';
import {useContext, useEffect, useState} from "react";
import ToggleOffDarkMode from "./icons/ToggleOffDarkMode.jsx";
import { getBoards, getLists, deleteBoard, updateBoard, createBoard, getBoardMembers, inviteMember } from "../api/trelloApi";
import WorkspaceItem from "./workspace/WorkspaceItem.jsx";
import CreateWorkspaceModal from "./workspace/CreateWorkspaceModal.jsx";
import MembersList from "./workspace/MembersList.jsx";
import PropTypes from "prop-types";
import BrandWhiteIcon from "./icons/BrandWhiteIcon.jsx";
import { MenuContext } from "./MenuContext";
import LoadingOverlay from "./LoadingOverlay.jsx";

Menu.propTypes = {
    onWorkspaceSelect: PropTypes.func.isRequired,
};

export const getBoardColor = (boardId) => {
    const boardColors = {
        "0": "#FF5733",
        "1": "#33FF57",
        "2": "#FF33A1",
        "3": "#3357FF",
        "4": "#FF33FF",
        "5": "#FFFF33",
    };

    // Créer un hash simple à partir de l'ID
    let hash = 0;
    const idStr = boardId.toString();
    for (let i = 0; i < idStr.length; i++) {
        hash = (hash * 31 + idStr.charCodeAt(i)) & 0xffffffff;
    }

    // Utiliser le hash pour déterminer l'index de couleur
    const colorIndex = Math.abs(hash % Object.keys(boardColors).length);
    return boardColors[colorIndex.toString()];
};

export default function Menu({ onWorkspaceSelect = () => {} }) {
    const {isMenuOpen, setIsMenuOpen} = useContext(MenuContext);
    const [darkMode, setDarkMode] = useState(false);
    const [boards, setBoards] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [lists, setLists] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [boardMembers, setBoardMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (Cookies.get('dark') === 'true') {
            document.documentElement.classList.add('dark');
            setDarkMode(true);
        }
    }, []);

    useEffect(() => {
        const loadBoards = async () => {
            const boardsData = await getBoards();
            if (Array.isArray(boardsData)) {
                setBoards(boardsData);
            } else {
                setBoards([]);
            }
        };
        loadBoards().then();
    }, []);

    useEffect(() => {
        const loadLists = async () => {
            if (selectedBoard) {
                const listsData = await getLists(selectedBoard.id);
                setLists(listsData);
            }
        };
        loadLists();
    }, [selectedBoard]);

    useEffect(() => {
        const menu = document.querySelector('aside');
        if (isMenuOpen) {
            menu.classList.add('w-64');
            menu.classList.remove('w-20');
        } else {
            menu.classList.add('w-20');
            menu.classList.remove('w-64');
        }
    }, [isMenuOpen]);

    const handleWorkspaceClick = (board) => {
        setSelectedBoard(board);
        onWorkspaceSelect(board, getBoardColor(board.id));

        // Charger les membres du tableau
        loadBoardMembers(board.id);
    };

    const loadBoardMembers = async (boardId) => {
        try {
            const members = await getBoardMembers(boardId);
            setBoardMembers(members);
        } catch (error) {
            console.error('Erreur lors du chargement des membres:', error);
        }
    };

    const handleDeleteBoard = async (boardId) => {
        try {
            setIsLoading(true);
            await deleteBoard(boardId);
            setBoards(boards.filter(board => board.id !== boardId));
            if (selectedBoard && selectedBoard.id === boardId) {
                setSelectedBoard(null);
                onWorkspaceSelect(null, null);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du tableau:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditBoard = async (boardId, newName) => {
        try {
            await updateBoard(boardId, { name: newName });
            setBoards(boards.map(board =>
                board.id === boardId ? { ...board, name: newName } : board
            ));
        } catch (error) {
            console.error('Erreur lors de la modification du tableau:', error);
        }
    };

    const handleCreateBoard = async (boardData) => {
        try {
            const newBoard = await createBoard(boardData);
            setBoards([...boards, newBoard]);
            setIsCreateModalOpen(false);
            return true;
        } catch (error) {
            console.error('Erreur lors de la création du tableau:', error);
            return false;
        }
    };

    const handleInviteMember = async (boardId, email) => {
        try {
            await inviteMember(boardId, email);
            // Recharger les membres après l'invitation
            loadBoardMembers(boardId);
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'invitation:', error);
            return false;
        }
    };

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
            Cookies.set('dark', 'true', { expires: 365 });
        } else {
            document.documentElement.classList.remove('dark');
            Cookies.set('dark', 'false', { expires: 365 });
        }
    };

    const handleToggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className={"fixed top-0 left-0 h-full w-20 z-50"}>
            <LoadingOverlay isVisible={isLoading} />
            <aside className="flex flex-col duration-1000 h-screen content-center bg-white dark:bg-pureDark border-r-2 dark:border-violet-900 border-gray-200 z-50">
                <button type="button" className={`${isMenuOpen ? "justify-end p-2" : "p-2"} flex focus:outline-none cursor-pointer transition-colors duration-1000 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-100 gap-y-8`} onClick={handleToggleMenu}>
                    <ToggleMenu/>
                </button>

                <a href="#" className={`${isMenuOpen ? "font-extrabold text-4xl bg-gradient-to-b  dark:text-white from-blue-400 to-purple-500 bg-clip-text text-transparent" : "p-2 flex-row dark:text-white text-gray-500 focus:outline-none transition-colors duration-1000 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-100 gap-y-8"} flex flex-row p-2`} >
                    <BrandIcon/>
                    <BrandWhiteIcon />
                    {`${isMenuOpen ? "AGILIX" : ""}`}
                </a>

                <a href="#" className="p-4 pl-6  text-gray-900 font-bold flex flex-row focus:outline-none transition-colors duration-1000 rounded-lg dark:text-white dark:hover:bg-gray-800 hover:bg-gray-100" onClick={() => {
                    setSelectedBoard(null);
                    onWorkspaceSelect(null, null);
                }}>
                    <Home/>
                    <span className="pl-2">
                        {`${isMenuOpen ? "Accueil" : ""}`}
                    </span>
                </a>

                <div className="p-4 pl-6 text-gray-900 font-bold flex flex-row content-center justify-between focus:outline-none transition-colors duration-1000 rounded-lg dark:text-white dark:hover:bg-gray-800 hover:bg-gray-100">
                    <div className="flex flex-row items-center">
                        <Suitcase />
                        <span className="pl-2 flex">
                            {`${isMenuOpen ? "Espaces de travail" : ""}`}
                        </span>
                    </div>
                    {isMenuOpen && (
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>

                {boards.map((board) => (
                    <div key={board.id} onClick={() => handleWorkspaceClick(board)}>
                        <WorkspaceItem
                            board={board}
                            isMenuOpen={isMenuOpen}
                            color={getBoardColor(board.id)}
                            onDelete={handleDeleteBoard}
                            onEdit={handleEditBoard}
                        />
                    </div>
                ))}

                <MembersList
                    isMenuOpen={isMenuOpen}
                    selectedBoard={selectedBoard}
                    boardMembers={boardMembers}
                    onInviteMember={handleInviteMember}
                />

                <button type="button" className={`${isMenuOpen ? "justify-evenly p-2" : "p-2"} flex flex-row-reverse items-center mt-auto cursor-pointer text-gray-900 font-bold focus:outline-none transition-colors duration-1000 rounded-lg dark:text-white dark:hover:bg-gray-800 hover:bg-gray-100"`} onClick={toggleDarkMode}>
                    {darkMode ? <ToggleOnDarkMode /> : <ToggleOffDarkMode/>}
                    {`${isMenuOpen ? "Thème" : ""}`}
                </button>
            </aside>

            <CreateWorkspaceModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateBoard}
            />
        </div>
    );
}
