// Configuration Playwright optimisée pour GoCrew
// Documentation : https://playwright.dev/docs/test-configuration

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
    testDir: './tests/e2e',
    timeout: 60000, // Timeout augmenté pour les workflows complets
    expect: {
        timeout: 10000 // Timeout pour les assertions
    },
    retries: 1, // 1 retry en cas d'échec
    workers: 1, // Exécution séquentielle pour éviter les conflits de données
    
    use: {
        baseURL: 'http://localhost:5173',
        headless: process.env.CI ? true : false, // Mode headless en CI, visible en local
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry',
        
        // Ralentir légèrement pour stabilité (seulement en local)
        slowMo: process.env.CI ? 0 : 100,
        
        // Configuration du navigateur
        viewport: { width: 1280, height: 720 },
        
        // Headers utiles
        extraHTTPHeaders: {
            'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
        }
    },

    // Configuration des navigateurs
    projects: [
        {
            name: 'chromium',
            use: { ...require('@playwright/test').devices['Desktop Chrome'] },
        },
        // Ajouter d'autres navigateurs si nécessaire
        // {
        //     name: 'firefox',
        //     use: { ...require('@playwright/test').devices['Desktop Firefox'] },
        // },
    ],

    // Configuration des rapports
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'test-results.json' }],
        ['list'] // Affichage console
    ],

    // Dossier de sortie
    outputDir: 'test-results/',
    
    // Setup global supprimé car causait des problèmes
    // globalSetup: require.resolve('./tests/setup.js'),
};

module.exports = config;
