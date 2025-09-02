import { HomeIcon } from 'lucide-react';
import React from 'react';
import BreadcrumbVector from '../components/icons/BreadcrumbVector';
import BreadcrumbHeader from '../components/BreadcrumbHeader';
import SearchFilterBar from '../components/SearchFilterBar';
import ChatCommentDots from '../components/icons/ChatCommentDots';

// Données factices pour simuler les tâches de voyage
const tasks = {
    todo: [
        { id: 1, title: "Faire une visite guidée de la ville", description: "Pour découvrir les lieux incontournables avec un local.", tag: "Activité", tagColor: "bg-yellow-200 text-yellow-800", date: "Dec 2 - 8", image: null, commentLength: 97 },
        { id: 2, title: "Trouver des événements culturels sur place", description: "Concerts, expos ou festivals pendant les dates du séjour.", tag: "Activité", tagColor: "bg-yellow-200 text-yellow-800", date: "Dec 2 - 8", image: null, commentLength: 97 },
        { id: 3, title: "Visiter la colonne", description: "Partir ensemble à St Perter, visiter la Colonne illuminé", tag: "Lieu à visiter", tagColor: "bg-pink-200 text-pink-800", date: "Dec 2 - 8", image: "/images/VisitColonne.png", commentLength: 97 },
    ],
    postponed: [
        { id: 4, title: "Louer une voiture sur place", description: "À envisager si besoin de mobilité hors centre-ville.", tag: "Préparatif", tagColor: "bg-blue-200 text-blue-800", date: "Dec 2 - 8", image: null, commentLength: 97 },
        { id: 5, title: "Visiter le Colisée", description: "Partir ensemble à Rome, visiter le Colisée", tag: "Lieu à visiter", tagColor: "bg-pink-200 text-pink-800", date: "Dec 2 - 8", image: "/images/VisiteColisee.png", commentLength: 97 },
    ],
    done: [
        { id: 6, title: "Réserver les billets d'avion", description: "Comparer les prix et choisir les meilleurs horaires.", tag: "Préparatif", tagColor: "bg-blue-200 text-blue-800", date: "Dec 2 - 8", image: null, commentLength: 97 },
        { id: 7, title: "Trouver un logement à Rome", description: "Airbnb, hôtel ou auberge : chaos factiori qui convient à tous.", tag: "Préparatif", tagColor: "bg-blue-200 text-blue-800", date: "Dec 2 - 8", image: null, commentLength: 97 },
        { id: 8, title: "Acheter une assurance voyage", description: "Pour partir l'esprit tranquille en cas d'imprévus.", tag: "Préparatif", tagColor: "bg-blue-200 text-blue-800", date: "Dec 2 - 8", image: null, commentLength: 97 },
    ]
};

const TaskCard = ({ task }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-2">
        {task.image && <img src={task.image} alt={task.title} className="w-full h-32 object-cover rounded-md mb-4" />}
        <h4 className="font-bold text-xl text-gray-900 mb-1">{task.title}</h4>
        {task.description && <p className="text-sm font-medium text-gray-500 mt-1">{task.description}</p>}
        <div className="mt-4 text-sm text-gray-600">
            <div>
                <span className={`inline-flex items-center text-xs font-semibold px-2 py-1 rounded-lg mb-3 ${task.tagColor}`}>{task.tag}</span>
            </div>
            <div className="md:flex items-center justify-between">
                <div className="flex items-center">
                    <img src="/images/Avatar.png" alt="user" className="w-6 h-6 rounded-full -ml-2 border-2 border-white" />
                    <p className="ml-2">{task.date}</p>
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
            {/* Barre recherche + filtres */}
            <SearchFilterBar
                filters={[
                    { label: 'Catégorie', options: [{ value: 'all', label: 'Tout' }] },
                    { label: 'Statut', options: [{ value: 'all', label: 'Tout' }] },
                ]}
                onSearch={() => console.log('Recherche')}
            />
            <main className="flex flex-col md:flex-row md:flex-wrap gap-6 overflow-y-auto pr-2 my-scrollbar">
                <Column title="A faire" tasks={tasks.todo} color="#280059" />
                <Column title="Reporter" tasks={tasks.postponed} color="#447CFF" />
                <Column title="Fait" tasks={tasks.done} color="#3AAA35" />
            </main>

        </div>
    );
}
