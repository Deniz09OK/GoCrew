import React, { useState, useEffect } from 'react';
import { X, Plus, MoreVertical, Calendar, Users, MapPin } from 'lucide-react';

const KanbanBoard = ({ isOpen, onClose, crew, announcement, type }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newTaskColumn, setNewTaskColumn] = useState(null);
    const [newTaskText, setNewTaskText] = useState('');

    // Charger les tâches depuis l'API
    useEffect(() => {
        if (isOpen && (crew?.id || announcement?.crew_id)) {
            fetchTasks();
        }
    }, [isOpen, crew, announcement]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const crewId = crew?.id || announcement?.crew_id;
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/tasks/crew/${crewId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            } else {
                console.error('Erreur lors du chargement des tâches');
                // Fallback avec des données de test si l'API échoue
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
                        title: "Réserver les billets d'avion",
                        description: "Compare les prix et choisis les meilleurs horaires",
                        status: "Fait",
                        priority: "Préparatif",
                        assignee: "Dec 2 - 8",
                        likes: 97,
                        color: "green"
                    }
                ]);
            }
        } catch (error) {
            console.error('Erreur réseau:', error);
            // Fallback avec données de test
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    // Créer une nouvelle tâche
    const createTask = async (column, title, description = "Nouvelle tâche ajoutée") => {
        try {
            const crewId = crew?.id || announcement?.crew_id;
            const token = localStorage.getItem('token');
            const dbStatus = statusMapping[column]; // Convertir vers le statut base de données
            
            const response = await fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    crew_id: crewId,
                    title,
                    description,
                    status: dbStatus,
                    priority: "Préparatif"
                })
            });

            if (response.ok) {
                const newTask = await response.json();
                setTasks(prevTasks => [...prevTasks, newTask]);
                return newTask;
            } else {
                console.error('Erreur lors de la création de la tâche');
            }
        } catch (error) {
            console.error('Erreur réseau:', error);
        }
    };

    // Mettre à jour une tâche
    const updateTask = async (taskId, updates) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });

            if (response.ok) {
                const updatedTask = await response.json();
                setTasks(prevTasks => 
                    prevTasks.map(task => task.id === taskId ? updatedTask : task)
                );
                return updatedTask;
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
        }
    };

    // Supprimer une tâche
    const deleteTask = async (taskId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    // Liker une tâche
    const toggleLike = async (taskId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/tasks/${taskId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const updatedTask = await response.json();
                setTasks(prevTasks => 
                    prevTasks.map(task => task.id === taskId ? updatedTask : task)
                );
            }
        } catch (error) {
            console.error('Erreur lors du like:', error);
        }
    };

    const columns = ['À faire', 'Reporter', 'Fait'];
    
    // Mapping entre les statuts de l'interface et de la base de données
    const statusMapping = {
        'À faire': 'todo',
        'Reporter': 'in_progress', 
        'Fait': 'done'
    };
    
    const reverseStatusMapping = {
        'todo': 'À faire',
        'in_progress': 'Reporter',
        'done': 'Fait'
    };
    
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
        const dbStatus = statusMapping[column];
        return tasks.filter(task => task.status === dbStatus);
    };

    const addNewTask = async (column) => {
        if (newTaskText.trim()) {
            await createTask(column, newTaskText);
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
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
                        </div>
                    ) : (
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
                                                        <span className="text-xs text-white font-medium">
                                                            {task.first_name ? task.first_name.charAt(0) : 'U'}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {task.first_name ? `${task.first_name} ${task.last_name}` : task.assignee || 'Non assigné'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => toggleLike(task.id)}
                                                        className="flex items-center text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <span className="text-xs mr-1">♡</span>
                                                        <span className="text-xs">{task.likes || 0}</span>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteTask(task.id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                        title="Supprimer la tâche"
                                                    >
                                                        <X size={14} />
                                                    </button>
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default KanbanBoard;
