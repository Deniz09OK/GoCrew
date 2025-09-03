import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Close from "../components/icons/Close";
import BreadcrumbHeader from "../components/BreadcrumbHeader";
import CardAnnouncement from "../components/CardAnnouncement";
import CreateAnnouncementModal from "../components/CreateAnnouncementModal";
import KanbanBoard from "../components/KanbanBoard";
import { Plus } from "lucide-react";

export default function Announcements() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [annonces, setAnnonces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isKanbanOpen, setIsKanbanOpen] = useState(false);

    // Charger les annonces depuis l'API
    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/announcements', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Données reçues de l\'API:', data); // Pour debug
                
                // Transformer les données pour correspondre au format attendu par CardAnnouncement
                const formattedData = data.map(announcement => ({
                    id: announcement.id,
                    title: announcement.title,
                    description: announcement.description,
                    date: announcement.crew?.start_date || announcement.posted_at,
                    lieu: announcement.crew?.destination || 'Destination non spécifiée',
                    budget: announcement.crew?.budget ? `${announcement.crew.budget}€` : 'Budget non défini',
                    participants: announcement.crew?.participants_count || 0,
                    crew_id: announcement.crew?.id,
                    crew_name: announcement.crew?.name,
                    owner: announcement.crew?.owner?.username,
                    posted_at: announcement.posted_at,
                    start_date: announcement.crew?.start_date,
                    end_date: announcement.crew?.end_date,
                    max_participants: announcement.crew?.max_participants,
                    destination: announcement.crew?.destination
                }));
                
                setAnnonces(formattedData);
            } else {
                console.error('Erreur lors du chargement des annonces');
                // Fallback vers les données mockées en cas d'erreur
                setAnnonces([
                    { id: 1, title: "Aventure au Japon", description: "Deux semaines de voyage au Japon entre tradition et modernité. Tokyo, Kyoto, sanctuaires anciens...", date: "18/03/2025", lieu: "Japon", budget: "1200€", participants: 6 },
                    { id: 2, title: "Road Trip Europe", description: "Découverte de l'Europe en van aménagé. Italie, Espagne, Portugal...", date: "15/06/2025", lieu: "Europe", budget: "800€", participants: 4 }
                ]);
            }
        } catch (error) {
            console.error('Erreur réseau:', error);
            // Fallback vers les données mockées
            setAnnonces([
                { id: 1, title: "Aventure au Japon", description: "Deux semaines de voyage au Japon entre tradition et modernité. Tokyo, Kyoto, sanctuaires anciens...", date: "18/03/2025", lieu: "Japon", budget: "1200€", participants: 6 },
                { id: 2, title: "Road Trip Europe", description: "Découverte de l'Europe en van aménagé. Italie, Espagne, Portugal...", date: "15/06/2025", lieu: "Europe", budget: "800€", participants: 4 }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAnnouncement = async (announcementData) => {
        await fetchAnnouncements();
    };

    const handleAnnouncementClick = (annonce) => {
        // Créer un objet crew à partir des données de l'annonce
        const crewData = {
            id: annonce.crew_id,
            name: annonce.title,
            description: annonce.description,
            destination: annonce.lieu || annonce.destination,
            start_date: annonce.start_date || annonce.date,
            end_date: annonce.end_date,
            budget: annonce.budget
        };
        
        setSelectedAnnouncement(crewData);
        setIsKanbanOpen(true);
    };

    const handleKanbanClose = () => {
        setIsKanbanOpen(false);
        setSelectedAnnouncement(null);
    };
    return (
        <div className="bg-white rounded-3xl border-1 border-gray-300 p-6">

            {/* Breadcrumb */}
            <BreadcrumbHeader
                title="Listes des annonces"
                buttonText="+ Nouveau"
                onButtonClick={() => setIsOpen(true)}
            />
            {/* Grille des annonces */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
                    {annonces.length > 0 ? (
                        annonces.map((annonce) => (
                            <div key={annonce.id} onClick={() => handleAnnouncementClick(annonce)} className="cursor-pointer">
                                <CardAnnouncement annonce={annonce} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500">Aucune annonce trouvée</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal de création d'annonces */}
            <CreateAnnouncementModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSubmit={handleCreateAnnouncement}
            />

            {/* Kanban Board Modal */}
            <KanbanBoard
                isOpen={isKanbanOpen}
                onClose={handleKanbanClose}
                crew={selectedAnnouncement}
                type="announcement"
            />
        </div>
    );
}

