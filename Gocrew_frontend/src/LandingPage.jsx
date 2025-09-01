import { useNavigate } from "react-router-dom";

// Import Google Fonts Urbanist dans le head du document
if (typeof document !== "undefined") {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Urbanist:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
}

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                backgroundColor: "#FFA325",
                fontFamily: "'Urbanist', sans-serif"
            }}
        >
            {/* Navbar */}
            <header className="flex justify-between items-center px-8 py-4 text-white">
                <img src="/public/images/logowhite.png" alt="GoCREW logo" className="h-12" />
                <nav className="flex gap-6 items-center">
                    <a href="#" className="hover:underline">Accueil</a>
                    <a href="#" className="hover:underline">Notre services</a>
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
                </div>

                {/* Illustration */}
                <div className="flex justify-center">
                    <img
                        src="/public/Landingpage.png"
                        alt="Voyage illustration"
                        className="w-[900px] max-w-full"
                    />
                </div>
            </main>
        </div>
    );
};

export default LandingPage;