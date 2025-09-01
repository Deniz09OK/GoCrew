import React, { useState } from 'react';
import Close from './icons/Close';

export default function CreateTripModal({ isOpen, onClose, onSuccess, defaultType = null }) {
  // Si defaultType est fourni, utiliser ça, sinon 'crew' par défaut
  const [tripType, setTripType] = useState(defaultType || 'crew'); // 'crew' ou 'announcement'
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    destination: '',
    budget: '',
    start_date: '',
    end_date: '',
    invites: [], // Commencer avec un tableau vide
    default_role: 'member' // Pour les annonces
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleInviteChange = (index, field, value) => {
    const newInvites = [...formData.invites];
    newInvites[index][field] = value;
    setFormData(prev => ({ ...prev, invites: newInvites }));
  };

  const addInvite = () => {
    setFormData(prev => ({
      ...prev,
      invites: [...prev.invites, { email: '', role: 'member' }]
    }));
  };

  const removeInvite = (index) => {
    setFormData(prev => ({
      ...prev,
      invites: prev.invites.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Le nom du voyage est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.destination.trim()) newErrors.destination = 'La destination est requise';
    if (!formData.budget || formData.budget <= 0) newErrors.budget = 'Le budget doit être supérieur à 0';
    if (!formData.start_date) newErrors.start_date = 'La date de début est requise';
    if (!formData.end_date) newErrors.end_date = 'La date de fin est requise';
    
    if (formData.start_date && formData.end_date && new Date(formData.start_date) >= new Date(formData.end_date)) {
      newErrors.end_date = 'La date de fin doit être après la date de début';
    }

    // Validation des invitations pour les crews
    if (tripType === 'crew') {
      formData.invites.forEach((invite, index) => {
        if (invite.email && !/\S+@\S+\.\S+/.test(invite.email)) {
          newErrors[`invite_${index}`] = 'Email invalide';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    // Test direct de la connexion
    console.log('=== TEST DIRECT ===');
    try {
      const testResponse = await fetch('http://localhost:3000/api/auth/user-by-email?email=admin@email.com');
      const testData = await testResponse.json();
      console.log('Test direct backend:', testData);
    } catch (testError) {
      console.log('Erreur test direct:', testError);
    }
    console.log('==================');
    
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      console.log('=== DEBUG INFO ===');
      console.log('Raw token from localStorage:', token);
      console.log('Raw user string from localStorage:', userStr);
      
      let user = null;
      if (userStr) {
        try {
          user = JSON.parse(userStr);
          console.log('User parsed successfully:', user);
        } catch (parseError) {
          console.log('Error parsing user data:', parseError);
        }
      }
      
      console.log('Final user object:', user);
      console.log('User ID:', user?.id);
      console.log('All localStorage keys:', Object.keys(localStorage));
      console.log('==================');
      
      if (!token) {
        console.log('❌ Token manquant');
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      }
      
      if (!user) {
        console.log('❌ User object manquant');
        throw new Error('Données utilisateur manquantes. Veuillez vous reconnecter.');
      }
      
      if (!user.id) {
        console.log('❌ User ID manquant, user:', user);
        throw new Error('ID utilisateur manquant. Veuillez vous reconnecter.');
      }
      
      console.log('✅ Authentification OK, user ID:', user.id);

      if (tripType === 'crew') {
        // Créer un crew privé avec invitations
        const crewResponse = await fetch('http://localhost:3000/api/crews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            destination: formData.destination,
            budget: parseInt(formData.budget),
            start_date: formData.start_date,
            end_date: formData.end_date,
            owner_id: user.id,
            invites: formData.invites.filter(invite => invite.email.trim())
          })
        });

        if (!crewResponse.ok) {
          throw new Error('Erreur lors de la création du crew');
        }

        const crew = await crewResponse.json();
        onSuccess && onSuccess(crew);

      } else {
        // Créer d'abord un crew puis une annonce publique
        const crewResponse = await fetch('http://localhost:3000/api/crews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            destination: formData.destination,
            budget: parseInt(formData.budget),
            start_date: formData.start_date,
            end_date: formData.end_date,
            owner_id: user.id
          })
        });

        if (!crewResponse.ok) {
          throw new Error('Erreur lors de la création du crew');
        }

        const crew = await crewResponse.json();

        // Créer l'annonce publique
        const announcementResponse = await fetch('http://localhost:3000/api/announcements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: formData.name,
            description: formData.description,
            crew_id: crew.id,
            is_public: true
          })
        });

        if (!announcementResponse.ok) {
          throw new Error('Erreur lors de la création de l\'annonce');
        }

        onSuccess && onSuccess(crew);
      }

      // Réinitialiser le formulaire
      setFormData({
        name: '',
        description: '',
        destination: '',
        budget: '',
        start_date: '',
        end_date: '',
        invites: [], // Tableau vide
        default_role: 'member'
      });
      setTripType('crew');
      onClose();
      
    } catch (error) {
      console.error('Erreur:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {defaultType === 'crew' ? 'Créer un nouveau voyage' 
               : defaultType === 'announcement' ? 'Publier une nouvelle annonce'
               : 'Planifier mon voyage'}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Close />
            </button>
          </div>

          {/* Type Selection - Seulement si pas de type par défaut */}
          {!defaultType && (
            <div className="mb-6">
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setTripType('crew')}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                    tripType === 'crew' 
                      ? 'border-[#FF6300] bg-[#FF6300] text-white' 
                      : 'border-gray-300 text-gray-700 hover:border-[#FF6300]'
                  }`}
                >
                  <div className="text-center">
                    <h3 className="font-bold">Crew</h3>
                    <p className="text-sm opacity-90">Voyage entre amis avec invitations</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setTripType('announcement')}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                    tripType === 'announcement' 
                      ? 'border-[#FF6300] bg-[#FF6300] text-white' 
                      : 'border-gray-300 text-gray-700 hover:border-[#FF6300]'
                  }`}
                >
                  <div className="text-center">
                    <h3 className="font-bold">Annonce</h3>
                    <p className="text-sm opacity-90">Voyage ouvert à tous</p>
                  </div>
                </button>
              </div>
            </div>
          )}          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom du voyage */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FF6300] focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Week-end à Barcelone"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FF6300] focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Décrivez votre voyage..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Destination *
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FF6300] focus:border-transparent ${
                  errors.destination ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Barcelone, Espagne"
              />
              {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Budget (€) *
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FF6300] focus:border-transparent ${
                  errors.budget ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="1500"
              />
              {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date début *
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FF6300] focus:border-transparent ${
                    errors.start_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date fin *
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FF6300] focus:border-transparent ${
                    errors.end_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
              </div>
            </div>

            {/* Section spécifique selon le type */}
            {tripType === 'crew' ? (
              /* Invitations pour crew privé */
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Inviter des amis (optionnel)
                  </label>
                  <button
                    type="button"
                    onClick={addInvite}
                    className="text-[#FF6300] hover:text-[#FFA325] text-sm font-medium"
                  >
                    + Ajouter une personne
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.invites.length > 0 ? (
                    formData.invites.map((invite, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <div className="flex-1">
                          <input
                            type="email"
                            placeholder="email@exemple.com"
                            value={invite.email}
                            onChange={(e) => handleInviteChange(index, 'email', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF6300] focus:border-transparent ${
                              errors[`invite_${index}`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors[`invite_${index}`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`invite_${index}`]}</p>
                          )}
                        </div>
                        <select
                          value={invite.role}
                          onChange={(e) => handleInviteChange(index, 'role', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6300] focus:border-transparent"
                        >
                          <option value="member">Membre</option>
                          <option value="viewer">Spectateur</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => removeInvite(index)}
                          className="px-3 py-2 text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">Aucune invitation pour le moment.</p>
                      <p className="text-xs">Cliquez sur "+ Ajouter une personne" pour inviter des amis.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Paramètres pour annonce publique */
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rôle par défaut pour les participants
                </label>
                <select
                  name="default_role"
                  value={formData.default_role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6300] focus:border-transparent"
                >
                  <option value="member">Membre (peuvent participer activement)</option>
                  <option value="viewer">Spectateur (peuvent seulement voir)</option>
                </select>
                
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    Cette annonce sera visible à tous les utilisateurs. Les personnes intéressées pourront rejoindre votre voyage avec le rôle sélectionné.
                  </p>
                </div>
              </div>
            )}

            {/* Error message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.submit}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#FF6300] text-white rounded-lg hover:bg-[#FFA325] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Création...' : `Créer ${tripType === 'crew' ? 'le crew' : 'l\'annonce'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
