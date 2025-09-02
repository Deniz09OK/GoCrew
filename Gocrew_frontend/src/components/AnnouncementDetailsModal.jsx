import React, { useState } from 'react';
import { MapPin, Calendar, DollarSign, Users, UserPlus, Settings, Eye } from 'lucide-react';

const AnnouncementDetailsModal = ({ isOpen, onClose, announcement, userRole, onJoin, onRoleChange }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen && announcement) {
      fetchParticipants();
    }
  }, [isOpen, announcement]);

  const fetchParticipants = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/announcements/${announcement.id}/participants`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setParticipants(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des participants:', error);
    }
  };

  const handleJoin = async () => {
    setLoading(true);
    try {
      await onJoin(announcement.id);
      await fetchParticipants();
    } catch (error) {
      console.error('Erreur lors de la participation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (participantId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/announcements/participants/${participantId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        await fetchParticipants();
      }
    } catch (error) {
      console.error('Erreur lors du changement de rôle:', error);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner': return '👑';
      case 'member': return '⭐';
      case 'viewer': return '👁️';
      default: return '👤';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'owner': return 'Propriétaire';
      case 'member': return 'Membre';
      case 'viewer': return 'Observateur';
      default: return 'Inconnu';
    }
  };

  if (!isOpen || !announcement) return null;

  const isOwner = userRole === 'owner';
  const isParticipant = userRole !== undefined;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{announcement.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  {announcement.destination}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {announcement.start_date && new Date(announcement.start_date).toLocaleDateString('fr-FR')}
                </span>
                {announcement.budget && (
                  <span className="flex items-center gap-1">
                    <DollarSign size={16} />
                    {announcement.budget}€
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 mb-6">{announcement.description || 'Aucune description disponible.'}</p>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Informations du voyage</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Date de début:</span>
                    <span>{announcement.start_date ? new Date(announcement.start_date).toLocaleDateString('fr-FR') : 'Non définie'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date de fin:</span>
                    <span>{announcement.end_date ? new Date(announcement.end_date).toLocaleDateString('fr-FR') : 'Non définie'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Budget estimé:</span>
                    <span>{announcement.budget ? `${announcement.budget}€` : 'Non défini'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Participants max:</span>
                    <span>{announcement.max_participants || 'Illimité'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">
                  Participants ({participants.length})
                </h3>
                {!isParticipant && (
                  <button
                    onClick={handleJoin}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 bg-[#FF6300] text-white rounded-lg hover:bg-[#e55a00] disabled:opacity-50"
                  >
                    <UserPlus size={16} />
                    {loading ? 'Rejoindre...' : 'Rejoindre'}
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        {participant.username?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{participant.username}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          {getRoleIcon(participant.role)}
                          {getRoleText(participant.role)}
                        </div>
                      </div>
                    </div>
                    
                    {isOwner && participant.role !== 'owner' && (
                      <div className="flex items-center gap-1">
                        <select
                          value={participant.role}
                          onChange={(e) => handleRoleChange(participant.id, e.target.value)}
                          className="text-xs p-1 border rounded"
                        >
                          <option value="viewer">Observateur</option>
                          <option value="member">Membre</option>
                          <option value="owner">Propriétaire</option>
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {participants.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucun participant pour le moment
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Fermer
            </button>
            {isParticipant && (
              <button
                className="px-4 py-2 bg-[#FF6300] text-white rounded-lg hover:bg-[#e55a00] transition-colors"
              >
                Accéder au planning
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetailsModal;
