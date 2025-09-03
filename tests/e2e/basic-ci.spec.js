import { test, expect } from '@playwright/test';

test.describe('GoCrew - Tests de base CI', () => {
    test('Application répond correctement', async ({ page }) => {
        console.log('🔍 Test de base - Vérification que l\'application répond');
        
        // Aller sur la page d'accueil
        await page.goto('/');
        
        // Vérifier que la page se charge
        await expect(page).toHaveTitle(/GoCrew|React/);
        
        console.log('✅ Application répond correctement');
    });
    
    test('Page de signup accessible', async ({ page }) => {
        console.log('🔍 Test de base - Vérification page signup');
        
        // Aller sur la page d'inscription
        await page.goto('/signup');
        
        // Vérifier que la page contient un formulaire d'inscription
        await expect(page.locator('form')).toBeVisible();
        
        console.log('✅ Page signup accessible');
    });
});
