import React from 'react';
import { X, Users, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlanTripModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleCrewChoice = () => {
    onClose();
    navigate('/trips'); // Redirige vers la page des trips/crews
  };

  const handleAnnouncementChoice = () => {
    onClose();
    navigate('/announcements'); // Redirige vers la page des annonces
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Planifier mon voyage</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Comment souhaitez-vous organiser votre voyage ?
          </p>

          <div className="space-y-4">
            {/* Option Crew (Privé) */}
            <div 
              onClick={handleCrewChoice}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF6300] hover:bg-orange-50 cursor-pointer transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Users size={24} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Créer un Crew</h3>
                  <p className="text-sm text-gray-600">
                    Voyage privé avec des amis ou des personnes invitées. 
                    Vous contrôlez qui peut rejoindre votre équipe.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      Privé
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      Sur invitation
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Option Annonce (Public) */}
            <div 
              onClick={handleAnnouncementChoice}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF6300] hover:bg-orange-50 cursor-pointer transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Globe size={24} className="text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Créer une Annonce</h3>
                  <p className="text-sm text-gray-600">
                    Voyage public visible par tous. Parfait pour trouver 
                    de nouveaux compagnons de voyage.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      Public
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      Ouvert à tous
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanTripModal;
