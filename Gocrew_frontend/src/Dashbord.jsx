

import React from 'react';

export default function Dashboard() {
    return (
        <>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Tableau de Bord</h1>
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Utilisateurs Actifs</h3>
                    <p className="text-4xl font-bold mt-2 text-primary">1,257</p>
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Ventes (Aujourd'hui)</h3>
                    <p className="text-4xl font-bold mt-2 text-primary">€ 3,450</p>
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Nouveaux Messages</h3>
                    <p className="text-4xl font-bold mt-2 text-primary">8</p>
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Tâches en Attente</h3>
                    <p className="text-4xl font-bold mt-2 text-primary">15</p>
                </div>
            </section>
            <section className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold text-lg mb-4">Activité Récente</h3>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-400">Espace réservé pour un graphique ou une liste d'activités</p>
                </div>
            </section>
        </>
    );
}

