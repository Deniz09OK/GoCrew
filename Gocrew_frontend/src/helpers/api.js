// Fonction pour ajouter des membres à un crew
export async function addCrewMembers(crewId, members) {
  const response = await fetch(`http://localhost:3000/crew-members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ crew_id: crewId, members }),
  });
  if (!response.ok) {
    let errMsg = 'Erreur lors de l\'ajout des membres.';
    try {
      const err = await response.json();
      errMsg = err.error || errMsg;
    } catch {}
    throw new Error(errMsg);
  }
  return response.json();
}
// Fonctions pour appeler l'API backend
export async function createCrew(data) {
  const response = await fetch('http://localhost:3000/api/crews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    let errMsg = 'Erreur lors de la création du crew.';
    try {
      const err = await response.json();
      errMsg = JSON.stringify(err) || errMsg;
    } catch (e) {
      errMsg += ' (erreur de parsing)';
    }
    throw new Error(errMsg);
  }
  // Retourne directement l'objet crew (pas crew.crew)
  return await response.json();
}

export async function createAnnouncement(data) {
  const response = await fetch('http://localhost:3001/announcements', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
