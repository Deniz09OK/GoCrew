import React, { useState, useEffect } from 'react';
import { X, Plus, MoreVertical, Calendar, Users, MapPin } from 'lucide-react';

const KanbanBoard = ({ isOpen, onClose, crew, announcement, type }) => {
    const [tasks, setTasks] = useState([]);
    const [newTaskColumn, setNewTaskColumn] = useState(null);
    const [newTaskText, setNewTaskText] = useState('');

    // Données d'exemple pour les tâches
    useEffect(() => {
        if (isOpen) {
            setTasks([
                {
                    id: 1,
                    title: "Faire une visite guidée de la ville",
                    description: "Pour découvrir les lieux incontournables avec un local",
                    status: "À faire",
                    priority: "Active",
                    assignee: "Dec 2 - 8",
                    likes: 97,
                    color: "purple"
                },
                {
                    id: 2,
                    title: "Trouver des événements culturels sur place",
                    description: "Concerts, expos ou festivals pendant les dates du séjour",
                    status: "À faire",
                    priority: "Active",
                    assignee: "Dec 2 - 8",
                    likes: 97,
                    color: "orange"
                },
                {
                    id: 3,
                    title: "Visiter la colonne",
                    description: "Pour ressembler à St-Renter, visiter la Colonne Humaine",
                    status: "À faire",
                    priority: "Active",
                    assignee: "Dec 2 - 8",
                    likes: 97,
                    color: "orange"
                },
                {
                    id: 4,
                    title: "Louer une voiture sur place",
                    description: "À envisager si besoin de mobilité hors centre-ville",
                    status: "Reporter",
                    priority: "Préparatif",
                    assignee: "Dec 2 - 8",
                    likes: 97,
                    color: "blue"
                },
                {
                    id: 5,
                    title: "Visiter le Colisée",
                    description: "Point emblématique à Rome, visiter le Colisée",
                    status: "Reporter",
                    priority: "LIVE A VISITER",
                    assignee: "Dec 2 - 8",
                    likes: 97,
                    color: "blue",
                    image: "/images/VisiteColisee.png"
                },
                {
                    id: 6,
                    title: "Réserver les billets d'avion",
                    description: "Compare les prix et choisis les meilleurs horaires",
                    status: "Fait",
                    priority: "Préparatif",
                    assignee: "Dec 2 - 8",
                    likes: 97,
                    color: "green"
                },
                {
                    id: 7,
                    title: "Trouver un logement à Rome",
                    description: "Airbnb, hôtel ou auberge - choisir l'option qui convient à tous",
                    status: "Fait",
                    priority: "Préparatif",
                    assignee: "Dec 2 - 8",
                    likes: 97,
                    color: "green"
                },
                {
                    id: 8,
                    title: "Acheter une assurance voyage",
                    description: "Pour partir l'esprit tranquille en cas d'imprévus",
                    status: "Fait",
                    priority: "Préparatif",
                    assignee: "Dec 2 - 8",
                    likes: 97,
                    color: "green"
                }
            ]);
        }
    }, [isOpen]);

    const columns = ['À faire', 'Reporter', 'Fait'];
    const columnColors = {
        'À faire': 'border-purple-200 bg-purple-50',
        'Reporter': 'border-blue-200 bg-blue-50', 
        'Fait': 'border-green-200 bg-green-50'
    };

    const priorityColors = {
        'Active': 'bg-orange-500',
        'Préparatif': 'bg-gray-400',
        'LIVE A VISITER': 'bg-purple-500'
    };

    const getTasksByColumn = (column) => {
        return tasks.filter(task => task.status === column);
    };

    const addNewTask = (column) => {
        if (newTaskText.trim()) {
            const newTask = {
                id: Date.now(),
                title: newTaskText,
                description: "Nouvelle tâche ajoutée",
                status: column,
                priority: "Préparatif",
                assignee: "Dec 2 - 8",
                likes: 0,
                color: column === 'À faire' ? 'purple' : column === 'Reporter' ? 'blue' : 'green'
            };
            setTasks([...tasks, newTask]);
            setNewTaskText('');
            setNewTaskColumn(null);
        }
    };

    if (!isOpen) return null;

    const title = crew ? crew.name : announcement ? announcement.title : 'Planning';
    const subtitle = crew ? crew.destination : announcement ? announcement.crew?.destination : '';

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#FF6300] to-[#FFA325] p-6 text-white">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-2xl font-bold">{title}</h2>
                            {subtitle && (
                                <div className="flex items-center mt-2 text-white/90">
                                    <MapPin size={16} className="mr-2" />
                                    <span>{subtitle}</span>
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={onClose}
                            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="flex items-center text-sm text-white/90">
                        <Users size={16} className="mr-2" />
                        <span>Équipe de {crew?.name || 'voyage'}</span>
                        <span className="mx-4">•</span>
                        <Calendar size={16} className="mr-2" />
                        <span>{crew?.start_date ? new Date(crew.start_date).toLocaleDateString('fr-FR') : 'À définir'}</span>
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="p-6 overflow-auto max-h-[calc(90vh-200px)]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[500px]">
                        {columns.map((column) => (
                            <div key={column} className={`rounded-xl border-2 p-4 ${columnColors[column]}`}>
                                {/* Column Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-2 ${
                                            column === 'À faire' ? 'bg-purple-500' : 
                                            column === 'Reporter' ? 'bg-blue-500' : 'bg-green-500'
                                        }`}></div>
                                        <h3 className="font-semibold text-gray-800">{column}</h3>
                                        <span className="ml-2 text-sm text-gray-500">
                                            {getTasksByColumn(column).length < 10 ? '0' : ''}{getTasksByColumn(column).length}
                                        </span>
                                    </div>
                                </div>

                                {/* Tasks */}
                                <div className="space-y-3">
                                    {getTasksByColumn(column).map((task) => (
                                        <div key={task.id} className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                                            {/* Priority Badge */}
                                            <div className="flex items-center justify-between mb-3">
                                                <span className={`px-2 py-1 rounded-full text-xs text-white font-medium ${priorityColors[task.priority] || 'bg-gray-400'}`}>
                                                    {task.priority}
                                                </span>
                                                <MoreVertical size={16} className="text-gray-400" />
                                            </div>

                                            {/* Task Image */}
                                            {task.image && (
                                                <div className="mb-3">
                                                    <img 
                                                        src={task.image} 
                                                        alt={task.title}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                </div>
                                            )}

                                            {/* Task Content */}
                                            <h4 className="font-semibold text-gray-900 mb-2 leading-tight">
                                                {task.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                                {task.description}
                                            </p>

                                            {/* Task Footer */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="w-6 h-6 bg-orange-400 rounded-full mr-2 flex items-center justify-center">
                                                        <span className="text-xs text-white font-medium">D</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">{task.assignee}</span>
                                                </div>
                                                <div className="flex items-center text-gray-400">
                                                    <span className="text-xs mr-1">♡</span>
                                                    <span className="text-xs">{task.likes}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add New Task */}
                                    {newTaskColumn === column ? (
                                        <div className="bg-white rounded-xl p-4 shadow-sm border">
                                            <input
                                                type="text"
                                                value={newTaskText}
                                                onChange={(e) => setNewTaskText(e.target.value)}
                                                placeholder="Titre de la tâche..."
                                                className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:border-[#FF6300]"
                                                autoFocus
                                                onKeyPress={(e) => e.key === 'Enter' && addNewTask(column)}
                                            />
                                            <div className="flex justify-end mt-2 gap-2">
                                                <button 
                                                    onClick={() => setNewTaskColumn(null)}
                                                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                                >
                                                    Annuler
                                                </button>
                                                <button 
                                                    onClick={() => addNewTask(column)}
                                                    className="px-3 py-1 text-sm bg-[#FF6300] text-white rounded hover:bg-[#FFA325]"
                                                >
                                                    Ajouter
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setNewTaskColumn(column)}
                                            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
                                        >
                                            <Plus size={16} className="mr-2" />
                                            Ajouter une carte
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KanbanBoard;
