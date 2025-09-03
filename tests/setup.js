// Setup global pour les tests Playwright GoCrew

// Hook pour nettoyer après chaque test
const { test, expect } = require('@playwright/test');

// Configuration globale
exports.default = async function globalSetup(config) {
    console.log('🚀 Configuration globale des tests GoCrew');
    
    // Vérifications préliminaires si nécessaire
    
    return () => {
        console.log('✅ Nettoyage global terminé');
    };
};
