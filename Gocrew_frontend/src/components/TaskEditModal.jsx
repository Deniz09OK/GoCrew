import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, Image, Trash2, Download, Eye } from 'lucide-react';

const TaskEditModal = ({ isOpen, onClose, task, onSave, onDelete }) => {
    const [editingTask, setEditingTask] = useState({
        id: '',
        title: '',
        description: '',
        priority: 'Préparatif',
        status: '',
        documents: []
    });
    const [isDragging, setIsDragging] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState([]);
    const fileInputRef = useRef(null);

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

    const statusMapping = {
        'todo': 'À faire',
        'in_progress': 'Reporter',
        'done': 'Fait'
    };

    // Initialiser les données de la tâche quand le modal s'ouvre
    useEffect(() => {
        if (isOpen && task) {
            setEditingTask({
                id: task.id,
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'Préparatif',
                status: task.status || 'todo',
                documents: []
            });
            // Charger les documents existants
            loadTaskDocuments(task.id);
        }
    }, [isOpen, task]);

    // Charger les documents d'une tâche
    const loadTaskDocuments = async (taskId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/documents/task/${taskId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const documents = await response.json();
                setEditingTask(prev => ({
                    ...prev,
                    documents: documents.map(doc => ({
                        id: doc.id,
                        name: doc.file_name,
                        type: doc.file_type,
                        size: doc.file_size,
                        url: `http://localhost:3000${doc.file_url}`,
                        uploadedAt: doc.uploaded_at
                    }))
                }));
            }
        } catch (error) {
            console.error('Erreur lors du chargement des documents:', error);
        }
    };

    // Gérer le drag and drop
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget.contains(e.relatedTarget)) return;
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    // Gérer les fichiers sélectionnés
    const handleFiles = async (files) => {
        const validFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/') || 
                               file.type === 'application/pdf' ||
                               file.type.startsWith('text/') ||
                               file.type === 'application/msword' ||
                               file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB max
            return isValidType && isValidSize;
        });

        if (validFiles.length !== files.length) {
            alert('Certains fichiers n\'ont pas pu être ajoutés. Seuls les images, PDF et documents texte de moins de 10MB sont acceptés.');
        }

        setUploadingFiles(validFiles.map(file => ({ file, progress: 0 })));

        // Simuler l'upload - ici vous devriez implémenter votre logique d'upload réelle
        for (let i = 0; i < validFiles.length; i++) {
            const file = validFiles[i];
            await simulateFileUpload(file, i);
        }
    };

    // Gérer l'upload réel des fichiers
    const uploadFileToServer = async (file, taskId) => {
        const formData = new FormData();
        formData.append('document', file);

        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch(`http://localhost:3000/api/documents/task/${taskId}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const uploadedDoc = await response.json();
                return {
                    id: uploadedDoc.id,
                    name: uploadedDoc.file_name,
                    type: uploadedDoc.file_type,
                    size: uploadedDoc.file_size,
                    url: `http://localhost:3000${uploadedDoc.file_url}`,
                    uploadedAt: uploadedDoc.uploaded_at
                };
            } else {
                throw new Error('Erreur lors de l\'upload');
            }
        } catch (error) {
            console.error('Erreur upload:', error);
            throw error;
        }
    };

    // Upload de fichier avec progression
    const simulateFileUpload = async (file, index) => {
        try {
            // Simulation de progression pour l'UI
            for (let progress = 0; progress <= 90; progress += 20) {
                await new Promise(resolve => setTimeout(resolve, 100));
                setUploadingFiles(prev => 
                    prev.map((item, i) => 
                        i === index ? { ...item, progress } : item
                    )
                );
            }

            // Upload réel du fichier
            const uploadedDoc = await uploadFileToServer(file, editingTask.id);

            // Finaliser la progression
            setUploadingFiles(prev => 
                prev.map((item, i) => 
                    i === index ? { ...item, progress: 100 } : item
                )
            );

            // Ajouter le document à la tâche
            setEditingTask(prev => ({
                ...prev,
                documents: [...prev.documents, uploadedDoc]
            }));

            // Retirer le fichier de la liste d'upload
            setTimeout(() => {
                setUploadingFiles(prev => prev.filter((_, i) => i !== index));
            }, 500);

        } catch (error) {
            // En cas d'erreur, retirer le fichier et afficher une erreur
            setUploadingFiles(prev => prev.filter((_, i) => i !== index));
            alert(`Erreur lors de l'upload de ${file.name}: ${error.message}`);
        }
    };

    // Ouvrir le sélecteur de fichiers
    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    // Supprimer un document
    const removeDocument = async (documentId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/documents/task-document/${documentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setEditingTask(prev => ({
                    ...prev,
                    documents: prev.documents.filter(doc => doc.id !== documentId)
                }));
            } else {
                alert('Erreur lors de la suppression du document');
            }
        } catch (error) {
            console.error('Erreur suppression:', error);
            alert('Erreur lors de la suppression du document');
        }
    };

    // Prévisualiser un document
    const previewDocument = (document) => {
        if (document.type.startsWith('image/')) {
            // Ouvrir l'image dans un nouvel onglet
            window.open(document.url, '_blank');
        } else {
            // Télécharger le fichier via l'API
            const token = localStorage.getItem('token');
            const link = document.createElement('a');
            link.href = `http://localhost:3000/api/documents/task-document/${document.id}/download`;
            link.target = '_blank';
            link.style.display = 'none';
            
            // Ajouter l'en-tête d'autorisation
            fetch(link.href, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error('Erreur lors du téléchargement');
            }).then(blob => {
                const url = window.URL.createObjectURL(blob);
                link.href = url;
                link.download = document.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }).catch(error => {
                console.error('Erreur téléchargement:', error);
                alert('Erreur lors du téléchargement du fichier');
            });
        }
    };

    // Obtenir l'icône appropriée pour le type de fichier
    const getFileIcon = (type) => {
        if (type.startsWith('image/')) {
            return <Image size={16} />;
        }
        return <FileText size={16} />;
    };

    // Formater la taille du fichier
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Sauvegarder les modifications
    const handleSave = async () => {
        if (editingTask.title.trim()) {
            try {
                // Préparer les données à envoyer (sans les documents qui sont gérés séparément)
                const taskData = {
                    title: editingTask.title,
                    description: editingTask.description,
                    priority: editingTask.priority,
                    status: editingTask.status
                };
                
                await onSave(taskData);
                onClose(); // Fermer le modal après la sauvegarde réussie
            } catch (error) {
                console.error('Erreur lors de la sauvegarde:', error);
                alert('Erreur lors de la sauvegarde de la tâche');
            }
        }
    };

    // Fermer le modal
    const handleClose = () => {
        setEditingTask({
            id: '',
            title: '',
            description: '',
            priority: 'Préparatif',
            status: '',
            documents: []
        });
        setUploadingFiles([]);
        setIsDragging(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-60 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#FF6300] to-[#FFA325] p-6 text-white">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">Modifier la tâche</h3>
                        <button 
                            onClick={handleClose}
                            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="space-y-6">
                        {/* Titre et Statut */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Titre de la tâche *
                                </label>
                                <input
                                    type="text"
                                    value={editingTask.title}
                                    onChange={(e) => setEditingTask(prev => ({...prev, title: e.target.value}))}
                                    placeholder="Titre de la tâche..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6300] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Statut
                                </label>
                                <select
                                    value={editingTask.status}
                                    onChange={(e) => setEditingTask(prev => ({...prev, status: e.target.value}))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6300] focus:border-transparent"
                                >
                                    <option value="todo">À faire</option>
                                    <option value="in_progress">Reporter</option>
                                    <option value="done">Fait</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={editingTask.description}
                                onChange={(e) => setEditingTask(prev => ({...prev, description: e.target.value}))}
                                placeholder="Détails de la tâche..."
                                rows={4}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6300] focus:border-transparent"
                            />
                        </div>

                        {/* Catégorie */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Catégorie
                            </label>
                            <select
                                value={editingTask.priority}
                                onChange={(e) => setEditingTask(prev => ({...prev, priority: e.target.value}))}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6300] focus:border-transparent"
                            >
                                {Object.keys(priorityColors).map((priority) => (
                                    <option key={priority} value={priority}>
                                        {priority}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Zone de documents */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Documents et images
                            </label>
                            
                            {/* Zone de drop */}
                            <div
                                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                    isDragging 
                                        ? 'border-[#FF6300] bg-orange-50' 
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <Upload size={32} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600 mb-2">
                                    Glissez-déposez vos fichiers ici ou 
                                    <button 
                                        onClick={handleFileSelect}
                                        className="text-[#FF6300] hover:text-[#FFA325] font-medium ml-1"
                                    >
                                        cliquez pour sélectionner
                                    </button>
                                </p>
                                <p className="text-xs text-gray-500">
                                    Images, PDF, documents texte - Max 10MB par fichier
                                </p>
                            </div>

                            {/* Input de fichier caché */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*,.pdf,.doc,.docx,.txt"
                                onChange={(e) => handleFiles(Array.from(e.target.files))}
                                className="hidden"
                            />

                            {/* Fichiers en cours d'upload */}
                            {uploadingFiles.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {uploadingFiles.map((item, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-700">{item.file.name}</span>
                                                <span className="text-xs text-gray-500">{item.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-[#FF6300] h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${item.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Liste des documents attachés */}
                            {editingTask.documents.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <h4 className="text-sm font-medium text-gray-700">Documents attachés</h4>
                                    {editingTask.documents.map((doc) => (
                                        <div key={doc.id} className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="text-gray-500">
                                                        {getFileIcon(doc.type)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatFileSize(doc.size)} • Ajouté {new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => previewDocument(doc)}
                                                        className="p-2 text-gray-500 hover:text-[#FF6300] hover:bg-orange-50 rounded-lg transition-colors"
                                                        title={doc.type.startsWith('image/') ? 'Prévisualiser' : 'Télécharger'}
                                                    >
                                                        {doc.type.startsWith('image/') ? <Eye size={16} /> : <Download size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={() => removeDocument(doc.id)}
                                                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                    <button 
                        onClick={() => onDelete(editingTask.id)}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        Supprimer la tâche
                    </button>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Annuler
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={!editingTask.title.trim()}
                            className="px-6 py-2 bg-[#FF6300] text-white rounded-lg hover:bg-[#FFA325] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            Sauvegarder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskEditModal;
