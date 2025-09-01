import { useNavigate } from "react-router-dom";


const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-orange-500 flex flex-col">
            {/* Navbar */}
            <header className="flex justify-between items-center px-8 py-4 text-white">
                <h1 className="text-2xl font-bold">GoCREW!</h1>
                <nav className="flex gap-6 items-center">
                    <a href="#" className="hover:underline">Accueil</a>
                    <a href="#" className="hover:underline">Notre services</a>
                    <a href="#" className="hover:underline">Nos Annonces</a>
                    <button
                        className="border px-4 py-1 rounded-full hover:bg-white hover:text-orange-500 transition"
                        onClick={() => navigate("/signup")}
                    >
                        S'inscrire
                    </button>
                    <button className="bg-white text-orange-500 px-4 py-1 rounded-full shadow hover:bg-gray-100 transition" 
                            onClick={() => navigate("/login")}>
                        Se connecter
                    </button>
                </nav>
            </header>

            {/* Section principale */}
            <main className="flex flex-1 items-center justify-between px-12">
                {/* Texte */}
                <div className="text-white max-w-lg">
                    <h2 className="text-4xl font-bold leading-tight">
                        VOTRE AVENTURE <br /> COMMENCE ICI.
                    </h2>
                    <p className="mt-4 text-lg">
                        GoCrew vous libère de l’organisation. Découvrez une solution moderne
                        et intuitive pour planifier vos séjours, choisir vos activités et
                        partager vos idées en un seul endroit.
                    </p>
                    <div className="mt-6 flex gap-4">
                        <button className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-full shadow">
                            Planifier mon voyage →
                        </button>
                        <button className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-orange-500 transition">
                            En savoir plus
                        </button>
                    </div>
                </div>

                {/* Illustration */}
                <div className="flex justify-center">
                    <img
                        src="/public/Landingpage.png"
                        alt="Voyage illustration"
                        className="w-[600px] max-w-full"
                    />
                </div>
            </main>
        </div>
    );
};

export default LandingPage;