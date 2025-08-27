import React, { useState } from "react";
import Close from "../components/icons/Close";
import BreadcrumbHeader from "../components/BreadcrumbHeader";
import SearchFilterBar from "../components/SearchFilterBar";
import CardAnnouncement from "../components/CardAnnouncement";

export default function Announcements() {
    const [isOpen, setIsOpen] = useState(false);

    // Data mock
    const annonces = [
        { id: 1, title: "Aventure au Japon", description: "Deux semaines de voyage au Japon entre tradition et modernité. Tokyo, Kyoto, sanctuaires anciens...", date: "18/03/2025", lieu: "Japon", budget: "1200€", participants: 6 },
        { id: 2, title: "Aventure au Japon", description: "Deux semaines de voyage au Japon entre tradition et modernité. Tokyo, Kyoto, sanctuaires anciens...", date: "18/03/2025", lieu: "Japon", budget: "1200€", participants: 6 },
        { id: 3, title: "Aventure au Japon", description: "Deux semaines de voyage au Japon entre tradition et modernité. Tokyo, Kyoto, sanctuaires anciens...", date: "18/03/2025", lieu: "Japon", budget: "1200€", participants: 6 },
        { id: 4, title: "Aventure au Japon", description: "Deux semaines de voyage au Japon entre tradition et modernité. Tokyo, Kyoto, sanctuaires anciens...", date: "18/03/2025", lieu: "Japon", budget: "1200€", participants: 6 },
        { id: 5, title: "Aventure au Japon", description: "Deux semaines de voyage au Japon entre tradition et modernité. Tokyo, Kyoto, sanctuaires anciens...", date: "18/03/2025", lieu: "Japon", budget: "1200€", participants: 6 },
        { id: 6, title: "Aventure au Japon", description: "Deux semaines de voyage au Japon entre tradition et modernité. Tokyo, Kyoto, sanctuaires anciens...", date: "18/03/2025", lieu: "Japon", budget: "1200€", participants: 6 },
        { id: 7, title: "Aventure au Japon", description: "Deux semaines de voyage au Japon entre tradition et modernité. Tokyo, Kyoto, sanctuaires anciens...", date: "18/03/2025", lieu: "Japon", budget: "1200€", participants: 6 },
        { id: 8, title: "Aventure au Japon", description: "Deux semaines de voyage au Japon entre tradition et modernité. Tokyo, Kyoto, sanctuaires anciens...", date: "18/03/2025", lieu: "Japon", budget: "1200€", participants: 6 },
    ]
    return (
        <div className="bg-white rounded-3xl border-1 border-gray-300 p-6">

            {/* Breadcrumb */}
            <BreadcrumbHeader
                title="Listes des annonces"
                buttonText="+ Nouveau"
                onButtonClick={() => setIsOpen(true)}
            />
            {/* Barre recherche + filtres */}
            <SearchFilterBar
                filters={[
                    { label: 'Catégorie', options: [{ value: 'all', label: 'Tout' }] },
                    { label: 'Statut', options: [{ value: 'all', label: 'Tout' }] },
                ]}
                onSearch={() => console.log('Recherche')}
            />

            {/* Grille des annonces */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
                {annonces.map((annonce) => (
                    <CardAnnouncement key={annonce.id} annonce={annonce} />
                ))}
            </div>

            {/* Modal ajout annonce */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-lg">
                        <div className="bg-[#FF6300] py-4 px-3 flex items-center justify-between rounded-t-xl">
                            <h2 className="text-2xl font-semibold text-[#F5F6EC]">Ajouter une annonce</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="bg-white p-1 rounded-full text-2xl font-bold"
                            >
                                <Close />
                            </button>
                        </div>
                        <div className="p-8 text-start">
                            <form className="space-y-4">
                                <div className="mb-4">
                                    <label className="mb-2 text-base font-semibold text-gray-700" htmlFor="title">Nom du voyage</label>
                                    <input
                                        type="text"
                                        placeholder="Tokyo Drift"
                                        className="w-full border border-gray-300 bg-[#F3F4F6] rounded-lg px-4 py-2 text-sm"
                                    />
                                </div>
                                <div className="flex items-center justify-between gap-4 mb-4">
                                    <div className="w-1/2">
                                        <label className="mb-2 text-base font-semibold text-gray-700" htmlFor="membres">Membres</label>
                                        <input
                                            type="number"
                                            placeholder="6"
                                            className="w-full border border-gray-300 bg-[#F3F4F6] rounded-lg px-4 py-2 text-sm"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="mb-2 text-base font-semibold text-gray-700" htmlFor="budget">Budget par personne</label>
                                        <input
                                            type="number"
                                            placeholder="600€"
                                            className="w-full border border-gray-300 bg-[#F3F4F6] rounded-lg px-4 py-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-4 mb-4">
                                    <div className="w-1/2">
                                        <label className="mb-2 text-base font-semibold text-gray-700" htmlFor="date">Date du voyage</label>
                                        <input
                                            type="date"
                                            placeholder="19/08/2025"
                                            className="w-full border border-gray-300 bg-[#F3F4F6] rounded-lg px-4 py-2 text-sm"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="mb-2 text-base font-semibold text-gray-700" htmlFor="lieu">Lieu</label>
                                        <select
                                            className="w-full border border-gray-300 bg-[#F3F4F6] rounded-lg px-4 py-2 text-sm"
                                        >
                                            <option value="tokyo">Tokyo</option>
                                        </select>
                                    </div>
                                </div>


                                <div className="mb-4">
                                    <label className="mb-2 text-base font-semibold text-gray-700" htmlFor="description">Description du voyage</label>
                                    <div className="bg-[#F3F4F6] p-4 rounded-xl">
                                        <h4 className="mb-2 text-base font-medium text-gray-700" >Description <span className="font-normal"> (120 caractères max)</span></h4>

                                        <textarea
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                                            rows={4}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="text-base font-semibold px-4 py-2 rounded-lg border  bg-gray-400 text-white"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="text-base font-semibold px-4 py-2 rounded-lg bg-[#FF6300] text-white"
                                    >
                                        Publier
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
