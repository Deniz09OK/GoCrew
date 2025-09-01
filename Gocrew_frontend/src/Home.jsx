
import React, { useRef } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CardAnnouncement from "./components/CardAnnouncement";
import CardFeature from "./components/CardFeatures";
import Heading from "./components/Heading";
import SearchFilterBar from "./components/SearchFilterBar";
import { ArrowRight } from "lucide-react";

export default function Home() {

    const annonces = [
        { id: 1, date: "18/03/2025", title: "Aventure au Japon", description: "Deux semaines au Japon...", lieu: "Japon", budget: "1200€", participants: 6 },
        { id: 2, date: "21/04/2025", title: "Découverte du Maroc", description: "Road trip au Maroc...", lieu: "Maroc", budget: "900€", participants: 4 },
        { id: 1, date: "18/03/2025", title: "Aventure au Japon", description: "Deux semaines au Japon...", lieu: "Japon", budget: "1200€", participants: 6 },
        { id: 2, date: "21/04/2025", title: "Découverte du Maroc", description: "Road trip au Maroc...", lieu: "Maroc", budget: "900€", participants: 4 },

        { id: 1, date: "18/03/2025", title: "Aventure au Japon", description: "Deux semaines au Japon...", lieu: "Japon", budget: "1200€", participants: 6 },
        { id: 2, date: "21/04/2025", title: "Découverte du Maroc", description: "Road trip au Maroc...", lieu: "Maroc", budget: "900€", participants: 4 },

        { id: 1, date: "18/03/2025", title: "Aventure au Japon", description: "Deux semaines au Japon...", lieu: "Japon", budget: "1200€", participants: 6 },
        { id: 2, date: "21/04/2025", title: "Découverte du Maroc", description: "Road trip au Maroc...", lieu: "Maroc", budget: "900€", participants: 4 },
        { id: 1, date: "18/03/2025", title: "Aventure au Japon", description: "Deux semaines au Japon...", lieu: "Japon", budget: "1200€", participants: 6 },

    ];

    const features = [
        { title: "Voyage en équipe", description: "Lancez votre propre projet ou trouvez un groupe qui vous correspond. GoCrew facilite la rencontre et la collaboration entre voyageurs.", icon: "/images/ShareTrip.png" },
        { title: "Planning intelligent", description: "Créez un itinéraire clair avec les tâches à réaliser avant et pendant le voyage. Ne ratez plus aucune étape importante.", icon: "/images/Planner.png" },
        { title: "Partage simplifié", description: "Discutez en temps réel avec vos co-voyageurs. Toutes les infos au même endroit, sans jongler entre les applis.", icon: "/images/Chat.png" },
    ];

    return (
        <div className="">
            {/* Header */}
            <Header />

            {/* HERO */}
            <div className="bg-[#FFA325] pb-8 md:pb-36 px-4 md:px-16  w-full pt-16">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
                    <div className="w-full md:w-1/2 text-start">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">VOTRE AVENTURE COMMENCE ICI.</h1>
                        <p className="text-2xl font-semibold mb-8">
                            GoCrew vous libère de l’organisation. Découvrez une solution moderne et intuitive pour planifier vos séjours.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button className="bg-[#FF6300] text-white px-8 py-3 rounded-2xl text-base font-bold shadow">Planifier mon voyage</button>
                            <button className="border border-white text-white px-8 py-3 rounded-2xl text-base font-bold hover:bg-white hover:text-[#FF6300] transition">
                                Voir les annonces
                            </button>
                        </div>
                    </div>
                    <div className="w-full md:w-3/5 mt-6 md:mt-0 flex justify-center md:justify-end">
                        <img
                            src="/images/Home.png"
                            alt="Illustration voyage"
                            className=""
                        />                    </div>
                </div>
            </div>

            {/* About */}
            <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 md:px-16 flex flex-col md:flex-row items-center justify-between w-full mt-16">
                <div className="w-full md:w-1/2 mt-6 md:mt-0 flex justify-center">
                    <img
                        src="/images/About.png"
                        alt="Illustration voyage"
                        className=""
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <div className="flex flex-col mb-12 text-gray-950">
                        <div className="flex items-center justify-start">
                            <div className=" bg-[#FF630014] border border-[#FF6300] text-[#FF6300] rounded-full py-2 px-16 text-base outline-none"
                            >
                                <h4 className="text-base font-bold text-[#FF6300]">GoCrew, c’est quoi ?</h4>
                            </div>
                        </div>
                        <h2 className="text-3xl font-extrabold text-[#FF6300] text-start my-5">Une plateforme pensée pour tous les voyageurs</h2>
                        <p className="font-normal text-xl text-start">GoCrew centralise tout ce dont vous avez besoin pour organiser votre voyage : hébergements, transports, activités, budget, documents importants…
                            Fini les allers-retours entre applis, e-mails et fichiers dispersés. Avec GoCrew, tout est réuni dans une seule plateforme intuitive, élégante et conçue pour vous faire gagner du temps.</p>
                        <div className="flex items-center justify-start mt-5">
                            <button className="flex items-center bg-[#FF6300] text-white px-6 py-3 mr-3 rounded-full">
                                Commencer maintenant <ArrowRight />
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Fonctionnalités */}
            <div className="py-20 px-6 text-center" id="services">
                <div className="max-w-4xl mx-auto">
                    <Heading title="Une organisation fluide, un voyage sans stress" description="Avec GoCrew, chaque détail est sous contrôle : tâches à faire, échanges entre voyageurs, coordination des étapes… tout est centralisé pour un séjour parfaitement orchestré." chip="Fonctionnalités" />

                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
                    {features.map((f, i) => (
                        <CardFeature key={i} {...f} />
                    ))}
                </div>
                <div className="flex items-center justify-center gap-20 mt-24">
                    <button className="flex items-center bg-[#FF6300] text-white px-6 py-3 mr-3 rounded-full">
                        Commencer maintenant <ArrowRight />
                    </button>
                </div>
            </div>

            {/* ANNONCES */}
            <div className="max-w-7xl mx-auto py-20 px-6 bg-white text-center" id="announcement">
                <div className="flex flex-col mb-12 text-gray-950">
                        <div className="flex items-center justify-start">
                            <div className=" bg-[#FF630014] border border-[#FF6300] text-[#FF6300] rounded-full py-2 px-16 text-base outline-none"
                            >
                                <h4 className="text-base font-bold text-[#FF6300]"> Annonces</h4>
                            </div>
                        </div>
                        <h2 className="text-3xl font-extrabold text-[#FF6300] text-start my-5">Trouvez ou proposez un voyage en quelques clics</h2>
                        <p className="font-normal text-xl text-start">Que vous soyez organisateur ou aventurier, explorez les voyages partagés par la communauté GoCrew.</p>
                     
                    </div>
                {/* Barre recherche + filtres */}
                <SearchFilterBar
                    filters={[
                        { label: 'Catégorie', options: [{ value: 'all', label: 'Tout' }] },
                        { label: 'Statut', options: [{ value: 'all', label: 'Tout' }] },
                    ]}
                    onSearch={() => console.log('Recherche')}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mx-auto">
                    {annonces.map((annonce) => (
                        <CardAnnouncement key={annonce.id} annonce={annonce} />
                    ))}
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}


