export default function AppWelcome() {
    return (
        <>
            <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                        Bienvenue sur Agilix
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
                        Sélectionnez un workspace dans le menu de gauche pour commencer à travailler,
                        ou créez-en un nouveau en cliquant sur le bouton "+" dans la section "Espaces de travail".
                    </p>
                    <div className="mt-8">
                        <svg className="w-32 h-32 mx-auto text-gray-400 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                </div>
            </div>
        </>
    )
}