/**
 * Utilitaires pour les tests
 */

const { Pool } = require('pg');
const bcrypt = require('bcrypt');

/**
 * Crée un pool de base de données pour les tests
 */
const createTestPool = () => {
    return new Pool({
        connectionString: process.env.DATABASE_URL || 'postgres://test:test@localhost:5432/testdb'
    });
};

/**
 * Crée un utilisateur de test dans la base de données
 */
const createTestUser = async (pool, userData = {}) => {
    const defaultData = {
        email: 'test@example.com',
        password: 'testpassword123',
        username: 'testuser',
        avatar_url: null
    };
    
    const user = { ...defaultData, ...userData };
    const passwordHash = await bcrypt.hash(user.password, 10);
    
    const result = await pool.query(
        'INSERT INTO users (email, password_hash, username, avatar_url) VALUES ($1, $2, $3, $4) RETURNING id, email, username, role, avatar_url',
        [user.email, passwordHash, user.username, user.avatar_url]
    );
    
    return { ...result.rows[0], password: user.password };
};

/**
 * Nettoie la base de données de test
 */
const cleanTestDatabase = async (pool) => {
    await pool.query('DELETE FROM users WHERE email LIKE \'%test%\' OR email LIKE \'%@example.com\'');
};

/**
 * Crée les tables nécessaires pour les tests
 */
const createTestTables = async (pool) => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            username VARCHAR(100),
            role VARCHAR(50) DEFAULT 'user',
            avatar_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
};

/**
 * Données de test valides pour l'inscription
 */
const getValidRegisterData = () => ({
    email: 'newuser@example.com',
    password: 'securepassword123',
    username: 'newuser',
    avatar_url: 'https://example.com/avatar.jpg'
});

/**
 * Données de test valides pour la connexion
 */
const getValidLoginData = () => ({
    username: 'testuser',
    password: 'testpassword123'
});

/**
 * Données de test invalides
 */
const getInvalidData = () => ({
    register: {
        missingEmail: { password: 'password123', username: 'user' },
        missingPassword: { email: 'test@example.com', username: 'user' },
        invalidEmail: { email: 'invalid-email', password: 'password123' },
        shortPassword: { email: 'test@example.com', password: '123' },
        duplicateEmail: { email: 'test@example.com', password: 'password123' }
    },
    login: {
        missingUsername: { password: 'password123' },
        missingPassword: { username: 'testuser' },
        wrongUsername: { username: 'wronguser', password: 'password123' },
        wrongPassword: { username: 'testuser', password: 'wrongpassword' }
    }
});

module.exports = {
    createTestPool,
    createTestUser,
    cleanTestDatabase,
    createTestTables,
    getValidRegisterData,
    getValidLoginData,
    getInvalidData
};
