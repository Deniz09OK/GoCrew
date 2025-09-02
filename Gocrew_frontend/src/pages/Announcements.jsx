import React, { useState, useEffect } from "react";
import { Globe, Calendar, MapPin, DollarSign } from 'lucide-react';
import Close from "../components/icons/Close";
import BreadcrumbHeader from "../components/BreadcrumbHeader";
import SearchFilterBar from "../components/SearchFilterBar";
import CreateTripModal from '../components/CreateTripModal';
import StatsCard from '../components/StatsCard';
import KanbanBoard from '../components/KanbanBoard';

// Composant pour une carte d'annonce (même que dans Trips.jsx)
const AnnouncementCard = ({ announcement, onClick }) => (
    <div 
        className="bg-[#FDFDFF] border border-[#FFE7C5] rounded-3xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onClick(announcement)}
    >
        {/* Header avec image */}
        <div className="bg-gradient-to-r from-[#FF6300] to-[#FFA325] p-4 flex items-center justify-between">
            <div className="flex items-center">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                    <img 
                        src="/images/Ticket.png" 
                        alt="Travel ticket" 
                        className="w-8 h-8 object-contain"
                    />
                </div>
                <div className="text-white">
                    <div className="flex items-center bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-medium">
                        <Globe size={12} className="mr-1" />
                        Annonce
                    </div>
                </div>
            </div>
            {announcement.crew && (
                <div className="text-white text-sm">
                    <Calendar size={16} className="inline mr-1" />
                    {new Date(announcement.crew.start_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </div>
            )}
        </div>
        
        {/* Contenu principal */}
        <div className="p-6">
            <h3 className="font-bold text-xl text-gray-900 mb-2">{announcement.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{announcement.description}</p>
            
            <div className="space-y-2 mb-4">
                {announcement.crew && (
                    <>
                        <div className="flex items-center text-sm text-gray-500">
                            <MapPin size={14} className="mr-2 text-[#FF6300]" />
                            <span className="font-medium text-gray-700">{announcement.crew.destination}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <DollarSign size={14} className="mr-2 text-[#FF6300]" />
                            <span className="font-medium text-[#FF6300]">{announcement.crew.budget}€ budget</span>
                        </div>
                    </>
                )}
            </div>
            
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                    Publié le {new Date(announcement.posted_at).toLocaleDateString()}
                </span>
                <button className="bg-[#FF6300] text-white px-4 py-2 rounded-full hover:bg-[#FFA325] transition-colors text-sm">
                    Rejoindre
                </button>
            </div>
        </div>
    </div>
);

export default function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isKanbanOpen, setIsKanbanOpen] = useState(false);

    // Fonction pour récupérer les annonces avec les détails du crew
    const fetchAnnouncements = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/announcements');
            if (!response.ok) throw new Error('Erreur lors du chargement des annonces');
            const announcements = await response.json();
            
            // Récupérer les détails du crew pour chaque annonce
            const announcementsWithCrews = await Promise.all(
                announcements.map(async (announcement) => {
                    try {
                        const crewResponse = await fetch(`http://localhost:3000/api/crews/${announcement.crew_id}`);
                        if (crewResponse.ok) {
                            const crew = await crewResponse.json();
                            return { ...announcement, crew };
                        }
                        return announcement;
                    } catch (error) {
                        console.error('Erreur détail crew:', error);
                        return announcement;
                    }
                })
            );
            
            setAnnouncements(announcementsWithCrews);
        } catch (error) {
            console.error('Erreur annonces:', error);
            setError(error.message);
        }
    };

    // Charger les données au montage du composant
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchAnnouncements();
            setLoading(false);
        };
        
        loadData();
    }, []);

    // Fonction appelée après création d'une nouvelle annonce
    const handleAnnouncementCreated = (newAnnouncement) => {
        console.log('Nouvelle annonce créée:', newAnnouncement);
        // Recharger les données
        fetchAnnouncements();
    };

    // Fonction pour ouvrir le Kanban
    const handleAnnouncementClick = (announcement) => {
        setSelectedAnnouncement(announcement);
        setIsKanbanOpen(true);
    };

    const handleKanbanClose = () => {
        setIsKanbanOpen(false);
        setSelectedAnnouncement(null);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-10 border-1 border-gray-300">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6300] mx-auto mb-4"></div>
                        <p className="text-gray-600">Chargement des annonces...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow-md p-10 border-1 border-gray-300">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
                    Erreur : {error}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-10 border-1 border-gray-300">
            {/* Breadcrumb */}
            <BreadcrumbHeader
                title="Liste des annonces"
                buttonText="+ Nouvelle annonce"
                onButtonClick={() => setIsModalOpen(true)}
            />

            {/* Barre recherche + filtres */}
            <SearchFilterBar
                filters={[
                    { label: 'Catégorie', options: [{ value: 'all', label: 'Toutes' }] },
                    { label: 'Destination', options: [{ value: 'all', label: 'Toutes' }] },
                ]}
                onSearch={(searchTerm) => console.log('Recherche:', searchTerm)}
            />

            {/* Statistiques */}
            <div className="flex justify-center mb-6 mt-3">
                <StatsCard 
                    icon={Globe}
                    title="Annonces disponibles"
                    count={announcements.length}
                    className="w-80"
                />
            </div>

            {/* Grille des annonces */}
            {announcements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {announcements.map((announcement) => (
                        <AnnouncementCard key={announcement.id} announcement={announcement} onClick={handleAnnouncementClick} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="mb-4">
                        <Globe size={48} className="text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune annonce disponible</h3>
                        <p className="text-gray-600">Soyez le premier à publier une annonce de voyage !</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#FF6300] text-white px-6 py-3 rounded-full hover:bg-[#FFA325] transition-colors"
                    >
                        Créer ma première annonce
                    </button>
                </div>
            )}

            {/* Modal de création d'annonce */}
            <CreateTripModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleAnnouncementCreated}
                defaultType="announcement"
            />

            {/* Kanban Board Modal */}
            <KanbanBoard
                isOpen={isKanbanOpen}
                onClose={handleKanbanClose}
                announcement={selectedAnnouncement}
                type="announcement"
            />
        </div>
    );
}
