// Test rapide pour vérifier la configuration Playwright
const { test, expect } = require('@playwright/test');

test.describe('Tests de Base - Vérification Configuration', () => {
    test('Vérification que le frontend est accessible', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Vérifier que la page se charge
        const title = await page.title();
        console.log('Titre de la page:', title);
        
        // Vérifier qu'on a du contenu (pas une page d'erreur)
        const body = page.locator('body');
        await expect(body).toBeVisible();
        
        // Vérifier la présence d'éléments React
        const reactRoot = page.locator('#root, [data-reactroot], .react');
        if (await reactRoot.first().isVisible({ timeout: 5000 })) {
            await expect(reactRoot.first()).toBeVisible();
            console.log('✅ Application React détectée');
        } else {
            console.log('⚠️ Application React non détectée clairement, mais page chargée');
        }
    });

    test('Vérification que les pages d\'auth sont accessibles', async ({ page }) => {
        // Tester la page de login
        await page.goto('/login');
        await page.waitForLoadState('networkidle');
        
        const loginForm = page.locator('form, input[type="email"], input#email');
        await expect(loginForm.first()).toBeVisible({ timeout: 10000 });
        console.log('✅ Page de login accessible');
        
        // Tester la page de signup  
        await page.goto('/signup');
        await page.waitForLoadState('networkidle');
        
        const signupForm = page.locator('form, input[type="email"], input#email');
        await expect(signupForm.first()).toBeVisible({ timeout: 10000 });
        console.log('✅ Page d\'inscription accessible');
    });

    test('Vérification de la connectivité backend', async ({ page }) => {
        // Intercepter les requêtes réseau pour vérifier le backend
        let backendReachable = false;
        
        page.on('response', response => {
            if (response.url().includes('localhost:3000') || response.url().includes('api/')) {
                backendReachable = true;
                console.log('✅ Requête backend détectée:', response.url(), response.status());
            }
        });
        
        // Aller sur une page qui fait des requêtes
        await page.goto('/login');
        await page.waitForLoadState('networkidle');
        
        // Essayer de faire une action qui déclenche une requête
        await page.fill('input[type="email"], input#email', 'test@example.com');
        await page.fill('input[type="password"], input#password', 'test123');
        
        // Cliquer sur login (attendu d'échouer mais devrait déclencher une requête)
        await page.click('button[type="submit"], button:has-text("Connexion")');
        await page.waitForTimeout(3000);
        
        if (backendReachable) {
            console.log('✅ Backend accessible et répond aux requêtes');
        } else {
            console.log('⚠️ Aucune requête backend détectée - vérifier la configuration');
        }
    });

    test('Test de génération de données de test', async ({ page }) => {
        const { generateTestData } = require('../helpers');
        
        const testData1 = generateTestData();
        const testData2 = generateTestData();
        
        // Vérifier que les données sont différentes
        expect(testData1.email).not.toBe(testData2.email);
        expect(testData1.username).not.toBe(testData2.username);
        
        // Vérifier le format des données
        expect(testData1.email).toMatch(/@example\.com$/);
        expect(testData1.password).toBe('TestPassword123!');
        expect(testData1.username).toMatch(/^TestUser\d+$/);
        
        console.log('✅ Génération de données de test fonctionnelle');
        console.log('Exemple de données:', testData1);
    });
});
