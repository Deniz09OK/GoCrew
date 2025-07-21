import React from 'react';

const HeaderPrivé = () => {
    return (
        <header className="bg-white shadow-sm border-b border-orange-200">
            <div className="flex items-center justify-between px-6 py-3">
                {/* Logo */}
                <div className="text-orange-600 font-bold text-xl tracking-wide">
                    <span className="bg-orange-100 px-2 py-1 rounded">GO</span>CREW!
                </div>

                {/* Menu de navigation */}
                <nav className="flex space-x-6 text-sm font-semibold text-orange-600">
                    <a href="/gestion" className="hover:underline">MA GESTION</a>
                    <a href="/crews" className="hover:underline">MES CREWS</a>
                    <a href="/annonces" className="hover:underline">MES ANNONCES</a>
                    <a href="/fichiers" className="hover:underline">MES FICHIERS</a>
                    <a href="/profil" className="hover:underline">MON PROFIL</a>
                </nav>
            </div>
        </header>
    );
};

export default HeaderPrivé;
