import Menu from "./Menu.jsx";
import Navbar from "./Navbar.jsx";
import MainApp from "./MainApp.jsx";
import NotificationManager, {setNotificationManager} from "./notifications/NotificationManager.jsx";
import {useEffect, useRef, useState} from "react";


export default function WelcomeScreen() {
    const notificationManagerRef = useRef(null);
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    const [workspaceColor, setWorkspaceColor] = useState(null);

    useEffect(() => {
        if (notificationManagerRef.current) {
            setNotificationManager(notificationManagerRef.current);
        }
    }, []);

    const handleWorkspaceSelect = (workspace, color) => {
        setSelectedWorkspace(workspace);
        setWorkspaceColor(color);
    };
    return (
            <div className="relative h-screen">
                <Menu className="z-50" onWorkspaceSelect={handleWorkspaceSelect} />
                <div className="flex flex-col h-full">
                    <Navbar className="z-10" selectedWorkspace={selectedWorkspace} workspaceColor={workspaceColor} />
                    <MainApp selectedWorkspace={selectedWorkspace} />
                </div>
                <NotificationManager ref={notificationManagerRef} />
            </div>
    );
} 