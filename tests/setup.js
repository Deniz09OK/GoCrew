/**
 * Configuration globale pour les tests Jest
 * Ce fichier est exécuté avant chaque test pour initialiser l'environnement
 */

// Configuration des variables d'environnement pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-jwt';
process.env.DATABASE_URL = 'postgres://test:test@localhost:5432/testdb';

// Configuration du timeout global pour les tests
jest.setTimeout(30000);

// Mock console.log pour réduire le bruit dans les tests
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
};

// Configuration globale pour les tests
beforeAll(() => {
    // Initialisation globale avant tous les tests
});

afterAll(() => {
    // Nettoyage global après tous les tests
});
