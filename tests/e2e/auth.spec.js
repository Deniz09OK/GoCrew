// Exemple de test Playwright pour l'inscription et la connexion
const { test, expect } = require('@playwright/test');

test.describe('Inscription et Connexion', () => {
    test('Inscription utilisateur', async ({ page }) => {
        await page.goto('/signup');
        await page.fill('input#name', 'testuserqa');
        await page.fill('input#email', 'testqa@example.com');
        await page.fill('input#password', 'TestPassword123!');
        await page.fill('input[placeholder="****************"]:below(label:text("Mot de passe"))', 'TestPassword123!');
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Inscription réussie')).toBeVisible();
    });

    test('Connexion utilisateur', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input#email', 'testqa@example.com');
        await page.fill('input#password', 'TestPassword123!');
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Bienvenue')).toBeVisible(); // À adapter selon le texte affiché après connexion
    });
});
