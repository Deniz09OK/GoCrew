import { motion } from "framer-motion";
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
                background: "linear-gradient(135deg, #FFA325 0%, #FFCB8E 100%)",
                fontFamily: "'Urbanist', sans-serif"
            }}
        >
            {/* Navbar */}
            <header className="flex justify-between items-center px-8 py-4 text-white bg-[#FFA325]/80 backdrop-blur-md shadow-lg sticky top-0 z-10">
                <img src="public/images/LogoWhite.png" alt="GoCREW logo" className="h-12 drop-shadow-lg" />
                <nav className="flex gap-6 items-center">
                    <button
                        className="border border-white px-4 py-1 rounded-full hover:bg-white hover:text-orange-500 transition font-semibold"
                        onClick={() => navigate("/signup")}
                    >
                        S'inscrire
                    </button>
                    <button
                        className="bg-white text-orange-500 px-4 py-1 rounded-full shadow hover:bg-gray-100 transition font-semibold"
                        onClick={() => navigate("/login")}
                    >
                        Se connecter
                    </button>
                </nav>
            </header>

            {/* Section principale */}
            <main className="flex flex-1 items-center justify-center px-6 md:px-12">
                <div className="flex flex-col md:flex-row items-center justify-center w-full gap-12">
                    {/* Texte */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-white max-w-lg text-center md:text-left"
                    >

                        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
                            VOTRE AVENTURE COMMENCE ICI.
                        </h2>
                        <p className="mt-4 text-lg font-medium">
                            GoCrew vous libère de l’organisation. Découvrez une solution moderne
                            et intuitive pour planifier vos séjours, choisir vos activités et
                            partager vos idées en un seul endroit.
                        </p>
                    </motion.div>

                    {/* Illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex justify-center"
                    >
                        <img
                            src="/images/Home.png"
                            alt="Voyage illustration"
                            className="w-[400px] md:w-[600px] max-w-full"
                        />
                    </motion.div>
                </div>
            </main>

            {/* Section supplémentaire */}
            <section className="bg-white text-gray-800 px-6 md:px-12 py-16">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Collage images */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="flex-1 flex justify-center"
                    >
                        <img
                            src="/images/About.png"
                            alt="Photos de voyage"
                            className="max-w-lg rounded-2xl"
                        />
                    </motion.div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-orange-500 font-bold mb-2">GoCrew, c’est quoi ?</h3>
                        <h2 className="text-3xl font-bold mb-4">
                            Une plateforme pensée pour tous les voyageurs
                        </h2>
                        <p className="mb-6 text-lg">
                            GoCrew centralise tout ce dont vous avez besoin pour organiser votre
                            voyage : hébergements, transports, activités, budget, documents
                            importants. Finis les aller-retours entre applis, e-mails et fichiers
                            dispersés. Avec GoCrew, tout est réuni dans une seule plateforme
                            intuitive, élégante et conçue pour vous faire gagner du temps.
                        </p>
                        <button
                            className="bg-orange-500 text-white px-6 py-3 rounded-full shadow hover:bg-orange-600 transition font-semibold"
                            onClick={() => navigate("/signup")}
                        >
                            Commencer maintenant →
                        </button>
                    </div>
                </div>
                <div className="mt-20 text-center">
                    <h3 className="text-orange-500 font-bold mb-2">Fonctionnalités</h3>
                    <h2 className="text-2xl font-bold mb-8">
                        Une organisation fluide, un voyage sans stress
                    </h2>
                    <p className="mb-8 text-lg">
                        Avec GoCrew, chaque détail est sous contrôle : tâches à faire, échanges entre voyageurs,
                        coordination des étapes… tout est centralisé pour un séjour parfaitement orchestré.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Bloc 1 */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-orange-100 p-6 rounded-2xl shadow hover:shadow-xl transition"
                        >
                            <img src="public/images/ShareTrip.png" alt="Voyages" className="h-14 mx-auto mb-4" />
                            <h3 className="font-bold text-lg mb-2">Voyages à partager</h3>
                            <p>
                                Lancez votre propre projet ou trouvez un groupe qui vous correspond.
                                GoCrew facilite la rencontre et la collaboration entre voyageurs.
                            </p>
                        </motion.div>

                        {/* Bloc 2 */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-orange-100 p-6 rounded-2xl shadow hover:shadow-xl transition"
                        >
                            <img src="public/images/Planner.png" alt="Planning" className="h-14 mx-auto mb-4" />
                            <h3 className="font-bold text-lg mb-2">Planning intelligent</h3>
                            <p>
                                Créez un itinéraire clair avec les tâches à réaliser avant et pendant
                                le voyage. Ne ratez plus aucune étape importante.
                            </p>
                        </motion.div>

                        {/* Bloc 3 */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-orange-100 p-6 rounded-2xl shadow hover:shadow-xl transition"
                        >
                            <img src="public/images/Chat.png" alt="Chat" className="h-14 mx-auto mb-4" />
                            <h3 className="font-bold text-lg mb-2">Chat centralisé</h3>
                            <p>
                                Discutez en temps réel avec vos co-voyageurs. Toutes les infos au
                                même endroit, sans jongler entre les applis.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
