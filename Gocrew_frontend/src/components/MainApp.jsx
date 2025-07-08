import PropTypes from 'prop-types';
import AppWelcome from "./AppWelcome.jsx";
import BoardView from "./board/BoardView.jsx";

MainApp.propTypes = {
    selectedWorkspace: PropTypes.object,
    workspaceColor: PropTypes.string,
};

export default function MainApp({ selectedWorkspace, workspaceColor }) {
    return (
        <div className="flex flex-col h-full bg-white dark:bg-purple-800 dark:text-white overflow-hidden relative z-0">
            {selectedWorkspace ? (
                <BoardView
                    boardId={selectedWorkspace.id}
                />
            ) : (
                <AppWelcome/>
            )}
        </div>
    );
}
