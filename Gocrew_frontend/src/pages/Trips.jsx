import { HomeIcon } from 'lucide-react';
import React from 'react';
import BreadcrumbVector from '../components/icons/BreadcrumbVector';
import BreadcrumbHeader from '../components/BreadcrumbHeader';
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
                <div className="flex items-center">
                    <ChatCommentDots />
                    <p className="ml-2">{task.commentLength}</p >
                </div>
            </div>
        </div>
    </div>
);

const Column = ({ title, tasks, color }) => (
    <div className="flex-1 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 gap-5">
        <div className={`mb-5 rounded-2xl p-4 bg-white border-t-4`} style={{ borderColor: color }}>
            <h3 className={`font-semibold flex items-center justify-between mb-1`}>
                {title}
                <span className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: color }}></span>
            </h3>
            <p className='text-start'>Nbr. d’activités : {tasks.length}</p>
        </div>
        <div className="text-start overflow-y-auto max-h-[500px] pr-2 my-scrollbar">
            {tasks.map(task => <TaskCard key={task.id} task={task} />)}
        </div>
    </div>
);



export default function Trips() {
    return (
        <div>
            {/* Breadcrumb */}
            <BreadcrumbHeader
                title="Voyages"
                buttonText="+ Nouveau"
                onButtonClick={() => setIsOpen(true)}
            />
            
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

        </div>
    );
}
