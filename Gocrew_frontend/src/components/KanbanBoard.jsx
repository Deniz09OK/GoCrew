import React, { useState, useEffect } from 'react';
import { X, Plus, MoreVertical, Calendar, Users, MapPin } from 'lucide-react';
import TaskEditModal from './TaskEditModal';

const KanbanBoard = ({ isOpen, onClose, crew, announcement, type }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newTaskColumn, setNewTaskColumn] = useState(null);
    const [newTaskText, setNewTaskText] = useState('');
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [newTaskDetails, setNewTaskDetails] = useState({
        title: '',
        description: '',
        priority: 'Préparatif',
        column: ''
    });
    const [editingPriorityTaskId, setEditingPriorityTaskId] = useState(null);
    const [editingTask, setEditingTask] = useState(null);

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
    const createTask = async (column, title, description = "Nouvelle tâche ajoutée", priority = "Préparatif") => {
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
                    priority: priority
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
        'Préparatif': 'bg-gray-400',
        'Active': 'bg-orange-500',
        'Paiement': 'bg-green-500',
        'Logement': 'bg-blue-500',
        'Transport': 'bg-indigo-500',
        'Lieux à visiter': 'bg-purple-500',
        'Restaurant': 'bg-red-500',
        'Shopping': 'bg-pink-500',
        'Activités': 'bg-yellow-500',
        'Urgent': 'bg-red-600',
        'Documents': 'bg-teal-500'
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

    // Ouvrir le modal pour une tâche détaillée
    const openTaskModal = (column) => {
        setNewTaskDetails({
            title: '',
            description: '',
            priority: 'Préparatif',
            column: column
        });
        setIsTaskModalOpen(true);
    };

    // Créer une tâche avec tous les détails
    const createDetailedTask = async () => {
        if (newTaskDetails.title.trim()) {
            await createTask(
                newTaskDetails.column, 
                newTaskDetails.title, 
                newTaskDetails.description || "Nouvelle tâche ajoutée",
                newTaskDetails.priority
            );
            setIsTaskModalOpen(false);
            setNewTaskDetails({
                title: '',
                description: '',
                priority: 'Préparatif',
                column: ''
            });
        }
    };

    // Mettre à jour la priorité d'une tâche
    const updateTaskPriority = async (taskId, newPriority) => {
        try {
            await updateTask(taskId, { priority: newPriority });
            setEditingPriorityTaskId(null);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la priorité:', error);
        }
    };

    // Ouvrir le modal d'édition
    const openEditModal = (task) => {
        setEditingTask(task);
    };

    // Sauvegarder les modifications d'une tâche
    const saveTaskEdits = async (updatedTaskData) => {
        if (updatedTaskData && updatedTaskData.title.trim()) {
            try {
                const response = await updateTask(editingTask.id, {
                    title: updatedTaskData.title,
                    description: updatedTaskData.description,
                    priority: updatedTaskData.priority,
                    status: updatedTaskData.status
                });
                
                if (response) {
                    console.log('Tâche sauvegardée avec succès');
                    setEditingTask(null);
                } else {
                    throw new Error('Erreur lors de la sauvegarde');
                }
            } catch (error) {
                console.error('Erreur lors de la sauvegarde:', error);
                alert('Erreur lors de la sauvegarde de la tâche');
            }
        }
    };

    // Fermer le modal d'édition
    const closeEditModal = () => {
        setEditingTask(null);
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
                                        <div 
                                            key={task.id} 
                                            className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => openEditModal(task)}
                                        >
                                            {/* Priority Badge */}
                                            <div className="flex items-center justify-between mb-3">
                                                {editingPriorityTaskId === task.id ? (
                                                    <select
                                                        value={task.priority}
                                                        onChange={(e) => updateTaskPriority(task.id, e.target.value)}
                                                        onBlur={() => setEditingPriorityTaskId(null)}
                                                        className="px-2 py-1 rounded-full text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-[#FF6300]"
                                                        autoFocus
                                                    >
                                                        {Object.keys(priorityColors).map((priority) => (
                                                            <option key={priority} value={priority}>
                                                                {priority}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span 
                                                        className={`px-2 py-1 rounded-full text-xs text-white font-medium cursor-pointer hover:opacity-80 transition-opacity ${priorityColors[task.priority] || 'bg-gray-400'}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingPriorityTaskId(task.id);
                                                        }}
                                                        title="Cliquer pour changer la catégorie"
                                                    >
                                                        {task.priority}
                                                    </span>
                                                )}
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
                                                {(task.username || task.assignee) && (
                                                    <div className="flex items-center">
                                                        <div className="w-6 h-6 bg-orange-400 rounded-full mr-2 flex items-center justify-center">
                                                            <span className="text-xs text-white font-medium">
                                                                {(task.username || task.assignee).charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-gray-500">
                                                            {task.username || task.assignee}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex items-center space-x-2">
                                                    {/* Indicateur de documents */}
                                                    {task.document_count > 0 && (
                                                        <div className="flex items-center text-gray-400 text-xs">
                                                            <span className="mr-1">📎</span>
                                                            <span>{task.document_count}</span>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleLike(task.id);
                                                        }}
                                                        className="flex items-center text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <span className="text-xs mr-1">♡</span>
                                                        <span className="text-xs">{task.likes || 0}</span>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteTask(task.id);
                                                        }}
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
                                        <div className="space-y-2">
                                            <button 
                                                onClick={() => setNewTaskColumn(column)}
                                                className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center text-sm"
                                            >
                                                <Plus size={16} className="mr-2" />
                                                Ajouter rapidement
                                            </button>
                                            <button 
                                                onClick={() => openTaskModal(column)}
                                                className="w-full p-3 bg-[#FF6300] text-white rounded-xl hover:bg-[#FFA325] transition-colors flex items-center justify-center text-sm"
                                            >
                                                <Plus size={16} className="mr-2" />
                                                Ajouter avec détails
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    )}
                </div>
            </div>

            {/* Modal pour créer une tâche détaillée */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 z-60 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Nouvelle tâche</h3>
                                <button 
                                    onClick={() => setIsTaskModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Titre */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Titre de la tâche *
                                    </label>
                                    <input
                                        type="text"
                                        value={newTaskDetails.title}
                                        onChange={(e) => setNewTaskDetails({...newTaskDetails, title: e.target.value})}
                                        placeholder="Ex: Réserver l'hôtel"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6300] focus:border-transparent"
                                        autoFocus
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description (optionnel)
                                    </label>
                                    <textarea
                                        value={newTaskDetails.description}
                                        onChange={(e) => setNewTaskDetails({...newTaskDetails, description: e.target.value})}
                                        placeholder="Détails de la tâche..."
                                        rows={3}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6300] focus:border-transparent"
                                    />
                                </div>

                                {/* Catégorie/Priorité */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Catégorie
                                    </label>
                                    <select
                                        value={newTaskDetails.priority}
                                        onChange={(e) => setNewTaskDetails({...newTaskDetails, priority: e.target.value})}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6300] focus:border-transparent"
                                    >
                                        {Object.keys(priorityColors).map((priority) => (
                                            <option key={priority} value={priority}>
                                                {priority}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Colonne de destination */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Statut
                                    </label>
                                    <div className="text-sm text-gray-600">
                                        Sera ajoutée à la colonne : <span className="font-medium">{newTaskDetails.column}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Boutons */}
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                <button 
                                    onClick={() => setIsTaskModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Annuler
                                </button>
                                <button 
                                    onClick={createDetailedTask}
                                    disabled={!newTaskDetails.title.trim()}
                                    className="px-6 py-2 bg-[#FF6300] text-white rounded-lg hover:bg-[#FFA325] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    Créer la tâche
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Nouveau Modal d'édition avancé */}
            <TaskEditModal
                isOpen={!!editingTask}
                onClose={closeEditModal}
                task={editingTask}
                onSave={saveTaskEdits}
                onDelete={deleteTask}
            />
        </div>
    );
};

export default KanbanBoard;
