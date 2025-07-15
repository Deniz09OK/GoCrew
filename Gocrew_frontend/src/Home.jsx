import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Menu, {getBoardColor} from "./components/Menu.jsx";
import { getBoards } from "./api/trelloApi.js";
import PropTypes from "prop-types";
import AppWelcome from "./components/AppWelcome.jsx";
import BoardView from "./components/board/BoardView.jsx";

export default function Home() {
    const [boards, setBoards] = useState([]);
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    const [workspaceColor, setWorkspaceColor] = useState(null);
    const [isMenuOpen] = useState(false);

    useEffect(() => {
        const fetchBoards = async () => {
            const fetchedBoards = await getBoards();
            setBoards(fetchedBoards);
        };
        fetchBoards().then();
    }, []);

    // Récupérer la couleur de l'espace de travail, soit la meme que celle dans le menu
    const handleWorkspaceSelect = (workspace) => {
        setSelectedWorkspace(workspace);
        const color = workspace ? getBoardColor(workspace.id) : null;
        setWorkspaceColor(color);
    }

    return (
        <div className="flex h-screen bg-pureLightBG dark:bg-pureDarkBG">
            <Menu 
                boards={boards} 
                selectedWorkspace={selectedWorkspace} 
                onWorkspaceSelect={handleWorkspaceSelect}
            />
            <div className="flex-1 flex flex-col">
                <Navbar 
                    selectedWorkspace={selectedWorkspace}
                    workspaceColor={workspaceColor}
                    className={`${isMenuOpen ? "left-220" : "left-120"} transition-all duration-300`}
                />
                <div className="flex flex-col w-full h-full overflow-hidden p-4">
                    {selectedWorkspace ? (
                        <BoardView
                            boardId={selectedWorkspace.id}
                            backgroundColor={workspaceColor.backgroundColor}
                        />
                    ) : (
                        <AppWelcome />
                    )}
                </div>
            </div>
        </div>
    );
}

Home.propTypes = {
    boards: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,

    })),
    selectedWorkspace: PropTypes.object,
    workspaceColor: PropTypes.func
}; 