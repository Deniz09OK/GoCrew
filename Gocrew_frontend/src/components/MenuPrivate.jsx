const MenuPrivate = () => {
    return (
        <aside className="bg-orange-500 text-white w-72 min-h-screen p-4 flex flex-col justify-between">
            {/* Logo & Accueil */}
            <div>
                <div className="text-3xl font-bold mb-6 text-center">GO CREW!</div>

                <button className="bg-white text-orange-500 w-full py-3 rounded-full flex items-center justify-start gap-3 px-4 mb-6">
                    <span className="font-semibold">Accueil</span>
                </button>

                {/* Menu items */}
                <div className="space-y-4">
                    {[
                        { label: "Mes Tâches" },
                        { label: "Mes Annonces" },
                        { label: "Mon budget" },
                    ].map((item, index) => (
                        <button
                            key={index}
                            className="bg-orange-400 w-full py-3 rounded-full flex items-center gap-3 px-4"
                        >
                            <span className="font-semibold">{item.label}</span>
                        </button>
                    ))}

                    {/* Crews */}
                    <div>
                        <div className="flex items-center justify-between bg-orange-400 py-3 px-4 rounded-full mb-2">
                            <div className="flex items-center gap-3">
                                <span className="font-semibold">Mes crews</span>
                            </div>
                        </div>

                        {/* Crew list */}
                        <ul className="text-sm space-y-2 pl-4">
                            <li className="flex items-center gap-2">
                                <span className="h-3 w-3 bg-blue-500 rounded-full"></span> Voyage Barcelone
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-3 w-3 bg-red-600 rounded-full"></span> Voyage Espagne
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-3 w-3 bg-green-500 rounded-full"></span> Voyage Italie
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Public chat */}
                <div className="mt-8">
                    <button className="bg-gradient-to-b from-white to-orange-100 text-orange-500 font-bold w-full py-3 rounded-full">
                        PUBLIC CHAT
                    </button>
                </div>
            </div>

            {/* Déconnexion */}
            <button className="bg-red-600 w-full py-3 rounded-full text-white font-bold flex items-center justify-center gap-3 mt-6">
                Déconnexion
            </button>
        </aside>
    );
};

export default MenuPrivate;
