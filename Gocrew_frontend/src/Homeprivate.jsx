import HeaderPrivé from "./components/HeaderPrivé";
import MenuPrivate from "./components/MenuPrivate";

export default function Homeprivate() {
    return (
        <div className="flex">
            {/* Menu latéral privé */}
            <MenuPrivate />
            {/* Contenu principal */}
            <HeaderPrivé />
            <div className="flex-1 h-screen bg-white flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-orange-600 mb-4">Bienvenue dans votre espace privé !</h1>
                <p className="text-lg text-gray-700">Retrouvez ici vos crews, annonces, tâches et plus encore.</p>
            </div>
        </div>
    );
}
