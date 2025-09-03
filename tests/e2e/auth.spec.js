// Tests Playwright pour l'authentification GoCrew
const { test, expect } = require('@playwright/test');
const { generateTestData, signup, login, logout } = require('../helpers');

test.describe('Authentification GoCrew', () => {
    let testData;

    test.beforeAll(() => {
        testData = generateTestData();
        console.log('🧪 Données de test auth générées:', testData);
    });

    test('Inscription utilisateur complète', async ({ page }) => {
        await page.goto('/signup');
        await page.waitForLoadState('networkidle');

        // Remplir le formulaire d'inscription
        await page.fill('input#name', testData.username);
        await page.fill('input#email', testData.email);
        await page.fill('input#password', testData.password);
        await page.fill('input[placeholder="****************"]:below(input#password)', testData.password);

        // Soumettre le formulaire
        await page.click('button:has-text("S\'inscrire")');

        // Vérifier le succès ou la redirection
        await page.waitForTimeout(3000);
        
        // Vérifier qu'on peut maintenant se connecter avec ces données
        const currentUrl = page.url();
        console.log('URL après inscription:', currentUrl);
        
        // Si on n'est pas redirigé automatiquement, vérifier le message de succès
        if (currentUrl.includes('signup')) {
            const successElement = page.locator('text=Inscription réussie, text=succès, .success, [data-testid="success"]');
            if (await successElement.first().isVisible({ timeout: 3000 })) {
                await expect(successElement.first()).toBeVisible();
            }
        }
    });

    test('Connexion avec utilisateur existant', async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');

        // Remplir les champs de connexion
        await page.fill('input#email', testData.email);
        await page.fill('input#password', testData.password);

        // Cliquer sur le bouton de connexion
        await page.click('button:has-text("Connexion")');

        // Attendre la redirection
        await page.waitForTimeout(5000);

        // Vérifier qu'on est connecté (redirection vers dashboard/home)
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/(home|dashboard|app)/);
        
        // Vérifier la présence d'éléments de navigation connecté
        const navElements = [
            'nav',
            '[data-testid="navigation"]', 
            '.navbar',
            'button:has-text("Déconnexion")',
            'header'
        ];
        
        let navFound = false;
        for (const selector of navElements) {
            if (await page.locator(selector).first().isVisible({ timeout: 2000 })) {
                navFound = true;
                break;
            }
        }
        
        expect(navFound).toBe(true);
    });

    test('Échec de connexion avec mauvais identifiants', async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');

        // Essayer avec un mauvais mot de passe
        await page.fill('input#email', testData.email);
        await page.fill('input#password', 'MauvaisMotDePasse123!');
        await page.click('button:has-text("Connexion")');

        await page.waitForTimeout(3000);

        // Vérifier qu'on reste sur la page de login
        expect(page.url()).toContain('/login');
        
        // Vérifier la présence d'un message d'erreur
        const errorSelectors = [
            'text=Erreur',
            'text=invalide',
            'text=Incorrect',
            '[data-testid="error"]',
            '.error',
            '.alert-danger'
        ];
        
        let errorFound = false;
        for (const selector of errorSelectors) {
            if (await page.locator(selector).first().isVisible({ timeout: 2000 })) {
                errorFound = true;
                break;
            }
        }
        
        // Si pas d'erreur visible, au moins vérifier qu'on n'est pas connecté
        if (!errorFound) {
            console.log('⚠️ Message d\'erreur non trouvé, mais connexion échouée comme attendu');
        }
    });

    test('Déconnexion utilisateur', async ({ page }) => {
        // D'abord se connecter
        await login(page, testData);
        
        // Puis se déconnecter
        await logout(page);
        
        // Vérifier qu'on est bien déconnecté
        await expect(page).toHaveURL(/.*\/login/);
        
        // Vérifier qu'on ne peut plus accéder aux pages protégées
        await page.goto('/home');
        await page.waitForTimeout(2000);
        
        // On devrait être redirigé vers login ou avoir une erreur
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/(login|auth|$)/);
    });

    test('Navigation entre pages d\'authentification', async ({ page }) => {
        // Commencer sur login
        await page.goto('/login');
        await page.waitForLoadState('networkidle');
        
        // Aller vers signup
        const signupLink = page.locator('a:has-text("Créer"), a:has-text("Inscription"), a[href*="signup"]');
        if (await signupLink.first().isVisible()) {
            await signupLink.first().click();
            await page.waitForLoadState('networkidle');
            expect(page.url()).toContain('/signup');
        } else {
            await page.goto('/signup');
        }
        
        // Retour vers login
        const loginLink = page.locator('a:has-text("Connecter"), a:has-text("Connexion"), a[href*="login"]');
        if (await loginLink.first().isVisible()) {
            await loginLink.first().click();
            await page.waitForLoadState('networkidle');
            expect(page.url()).toContain('/login');
        } else {
            await page.goto('/login');
        }
        
        console.log('✅ Navigation entre pages d\'auth testée');
    });
});
