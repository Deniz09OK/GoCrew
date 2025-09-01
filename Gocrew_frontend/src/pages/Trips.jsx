import React, { useState, useEffect } from 'react';
import { HomeIcon, Users, Calendar, MapPin, DollarSign } from 'lucide-react';
import BreadcrumbHeader from '../components/BreadcrumbHeader';
import SearchFilterBar from '../components/SearchFilterBar';
import CreateTripModal from '../components/CreateTripModal';
import StatsCard from '../components/StatsCard';
import KanbanBoard from '../components/KanbanBoard';

// Composant pour une carte de crew
const CrewCard = ({ crew, onClick }) => (
    <div 
        className="bg-[#FDFDFF] border border-[#FFE7C5] rounded-3xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onClick(crew)}
    >
        {/* Header avec image */}
        <div className="bg-gradient-to-r from-[#FF6300] to-[#FFA325] p-4 flex items-center justify-between">
            <div className="flex items-center">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                    <img 
                        src="/images/Planner.png" 
                        alt="Crew planning" 
                        className="w-8 h-8 object-contain"
                    />
                </div>
                <div className="text-white">
                    <div className="flex items-center bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-medium">
                        <Users size={12} className="mr-1" />
                        Crew
                    </div>
                </div>
            </div>
            <div className="text-white text-sm">
                <Calendar size={16} className="inline mr-1" />
                {new Date(crew.start_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </div>
        </div>
        
        {/* Contenu principal */}
        <div className="p-6">
            <h3 className="font-bold text-xl text-gray-900 mb-2">{crew.name}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{crew.description}</p>
            
            <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                    <MapPin size={14} className="mr-2 text-[#FF6300]" />
                    <span className="font-medium text-gray-700">{crew.destination}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                    <DollarSign size={14} className="mr-2 text-[#FF6300]" />
                    <span className="font-medium text-[#FF6300]">{crew.budget}€ budget</span>
                </div>
            </div>
            
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                    Créé le {new Date(crew.created_at).toLocaleDateString()}
                </span>
                <button className="bg-[#FF6300] text-white px-4 py-2 rounded-full hover:bg-[#FFA325] transition-colors text-sm">
                    Voir détails
                </button>
            </div>
        </div>
    </div>
);

export default function Trips() {
    const [crews, setCrews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'crews'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCrew, setSelectedCrew] = useState(null);
    const [isKanbanOpen, setIsKanbanOpen] = useState(false);

    // Fonction pour récupérer les crews
    const fetchCrews = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/crews');
            if (!response.ok) throw new Error('Erreur lors du chargement des crews');
            const data = await response.json();
            setCrews(data);
        } catch (error) {
            console.error('Erreur crews:', error);
            setError(error.message);
        }
    };

    // Charger les données au montage du composant
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchCrews();
            setLoading(false);
        };
        
        loadData();
    }, []);

    // Fonction appelée après création d'un nouveau voyage
    const handleTripCreated = (newTrip) => {
        console.log('Nouveau voyage créé:', newTrip);
        // Recharger les données
        fetchCrews();
    };

    // Fonction pour ouvrir le Kanban
    const handleCrewClick = (crew) => {
        setSelectedCrew(crew);
        setIsKanbanOpen(true);
    };

    const handleKanbanClose = () => {
        setIsKanbanOpen(false);
        setSelectedCrew(null);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-10 border-1 border-gray-300">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6300] mx-auto mb-4"></div>
                        <p className="text-gray-600">Chargement des voyages...</p>
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

    // Filtrer les crews selon le filtre sélectionné
    const filteredCrews = filter === 'all' ? crews : crews;

    return (
        <div className="bg-white rounded-xl shadow-md p-10 border-1 border-gray-300">
            {/* Breadcrumb */}
            <BreadcrumbHeader
                title="Voyages"
                buttonText="+ Nouveau voyage"
                onButtonClick={() => setIsModalOpen(true)}
            />
            
            {/* Barre recherche + filtres */}
            <SearchFilterBar
                filters={[
                    { 
                        label: 'Type', 
                        options: [
                            { value: 'all', label: 'Tous les crews' },
                            { value: 'crews', label: 'Mes crews' }
                        ]
                    }
                ]}
                onFilterChange={(filters) => setFilter(filters.Type || 'all')}
                onSearch={(searchTerm) => console.log('Recherche:', searchTerm)}
            />

            {/* Statistiques */}
            <div className="flex justify-center mb-6 mt-3">
                <StatsCard 
                    icon={Users}
                    title="Mes Crews"
                    count={crews.length}
                    className="w-80"
                />
            </div>

            {/* Contenu principal */}
            <main className="space-y-8">
                {/* Section Crews */}
                {filteredCrews.length > 0 && (
                    <section>
                        <div className="flex items-center mb-4">
                            <Users className="text-[#FF6300] mr-2" size={20} />
                            <h2 className="text-xl font-bold text-gray-900">Mes Crews</h2>
                            <span className="ml-2 bg-[#FFA32514] text-[#FF6300] px-2 py-1 rounded-full text-sm border border-[#FFA32566]">
                                {filteredCrews.length}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCrews.map(crew => (
                                <CrewCard key={crew.id} crew={crew} onClick={handleCrewClick} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Message si aucun voyage */}
                {crews.length === 0 && (
                    <div className="text-center py-12">
                        <div className="mb-4">
                            <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun voyage pour le moment</h3>
                            <p className="text-gray-600">Créez votre premier voyage ou rejoignez une annonce publique !</p>
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#FF6300] text-white px-6 py-3 rounded-full hover:bg-[#FFA325] transition-colors"
                        >
                            Créer mon premier voyage
                        </button>
                    </div>
                )}
            </main>

            {/* Modal de création de voyage */}
            <CreateTripModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleTripCreated}
                defaultType="crew"
            />

            {/* Kanban Board Modal */}
            <KanbanBoard
                isOpen={isKanbanOpen}
                onClose={handleKanbanClose}
                crew={selectedCrew}
                type="crew"
            />
        </div>
    );
}
