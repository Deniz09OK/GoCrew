// Tests Playwright complets pour GoCrew - Workflow utilisateur SANS suppressions
const { test, expect } = require('@playwright/test');
const {
    generateTestData,
    signup,
    login,
    logout,
    navigateToSection,
    createAnnouncement,
    createCrew,
    createTask,
    editTask,
    deleteTask,
    deleteItem,
    waitForElement
} = require('../helpers');

test.describe('GoCrew - Workflow Utilisateur Complet (Version Succès)', () => {
    let testData;

    test.beforeEach(async ({ page }) => {
        testData = generateTestData();
        await page.goto('http://localhost:5173');
        console.log('🧪 Données de test générées:', testData);
    });

    test('Workflow complet utilisateur - Inscription à Kanban Management', async ({ page }) => {
        console.log('🚀 Début du workflow complet utilisateur');
        
        // ========== ÉTAPE 1: INSCRIPTION ==========
        console.log('📝 Étape 1: Inscription');
        await test.step('S\'inscrire', async () => {
            await signup(page, testData);
            console.log('✅ Inscription terminée');
        });

        // ========== ÉTAPE 2: CONNEXION ==========
        console.log('🔐 Étape 2: Connexion');
        await test.step('Se connecter', async () => {
            await login(page, testData);
            console.log('✅ Connexion réussie');
        });

        // ========== ÉTAPE 3: PROFIL ==========
        console.log('👤 Étape 3: Clic sur le bouton Profil');
        await test.step('Aller sur profil', async () => {
            await navigateToSection(page, 'profile');
            console.log('✅ Navigation vers profil effectuée');
        });

        // ========== ÉTAPE 4: ACCUEIL ==========
        console.log('🏠 Étape 4: Clic sur le bouton Accueil');
        await test.step('Aller sur accueil', async () => {
            await navigateToSection(page, 'dashboard');
            console.log('✅ Navigation vers accueil effectuée');
        });

        // ========== ÉTAPE 5: ANNONCES ==========
        console.log('📢 Étape 5: Clic sur le bouton Annonces');
        await test.step('Aller sur annonces', async () => {
            await navigateToSection(page, 'announcements');
            console.log('✅ Navigation vers annonces effectuée');
        });

        // ========== ÉTAPE 6: CRÉER UNE ANNONCE ==========
        console.log('➕ Étape 6: Création d\'une annonce');
        await test.step('Créer une annonce', async () => {
            await createAnnouncement(page, testData);
            console.log('✅ Annonce créée avec succès');
        });

        // ========== ÉTAPE 7: OUVRIR LE KANBAN DE L'ANNONCE ==========
        console.log('📋 Étape 7: Ouverture du kanban de l\'annonce');
        await test.step('Ouvrir kanban de l\'annonce', async () => {
            // Cliquer sur l'annonce créée - elle devrait être visible dans la grille
            await page.waitForTimeout(2000); // Attendre que la grille soit mise à jour
            
            // Chercher la carte d'annonce nouvellement créée
            const announcementSelectors = [
                `.cursor-pointer:has-text("${testData.announcementTitle}")`,
                `[class*="bg-white"]:has-text("${testData.announcementTitle}")`,
                `[class*="card"]:has-text("${testData.announcementTitle}")`,
                `text=${testData.announcementTitle}`
            ];
            
            let announcementCard = null;
            for (const selector of announcementSelectors) {
                try {
                    announcementCard = page.locator(selector).first();
                    if (await announcementCard.isVisible({ timeout: 3000 })) {
                        console.log(`   ✅ Carte d'annonce trouvée avec: ${selector}`);
                        break;
                    }
                } catch (error) {
                    console.log(`   ❌ Carte non trouvée avec: ${selector}`);
                    continue;
                }
            }
            
            if (!announcementCard) {
                throw new Error('Carte d\'annonce non trouvée après création');
            }
            
            // Cliquer sur la carte d'annonce
            await announcementCard.click();
            console.log('✅ Clic sur la carte d\'annonce effectué');
            
            // Attendre que le modal Kanban s'ouvre
            const kanbanModalSelectors = [
                '.fixed.inset-0',
                '[role="dialog"]',
                '.z-50',
                '.bg-black.bg-opacity-50'
            ];
            
            let kanbanModal = null;
            for (const selector of kanbanModalSelectors) {
                try {
                    kanbanModal = await page.waitForSelector(selector, { timeout: 8000 });
                    if (kanbanModal) {
                        console.log(`   ✅ Modal Kanban trouvé avec: ${selector}`);
                        break;
                    }
                } catch (error) {
                    console.log(`   ❌ Modal non trouvé avec: ${selector}`);
                    continue;
                }
            }
            
            console.log('✅ Kanban de l\'annonce ouvert');
        });

        // ========== ÉTAPE 8: CRÉER UNE CARD DANS L'ANNONCE ==========
        console.log('📝 Étape 8: Création d\'une card dans l\'annonce');
        const announcementTaskTitle = `${testData.taskTitle} Annonce`;
        await test.step('Créer une tâche dans l\'annonce', async () => {
            await createTask(page, announcementTaskTitle);
            
            // Vérifier que la tâche a été créée
            const taskCard = page.locator(`text=${announcementTaskTitle}`);
            await expect(taskCard).toBeVisible({ timeout: 10000 });
            console.log('✅ Tâche créée dans l\'annonce');
        });

        // ========== ÉTAPE 9: MODIFIER LA CARD ==========
        console.log('✏️ Étape 9: Modification de la card');
        const modifiedTaskTitle = `${announcementTaskTitle} - Modifiée`;
        await test.step('Modifier la tâche de l\'annonce', async () => {
            await editTask(page, announcementTaskTitle, modifiedTaskTitle);
            
            // Vérifier que la tâche a été modifiée
            const modifiedTaskCard = page.locator(`text=${modifiedTaskTitle}`);
            await expect(modifiedTaskCard).toBeVisible({ timeout: 10000 });
            console.log('✅ Tâche modifiée dans l\'annonce');
        });

        // ========== ÉTAPE 10: SUPPRIMER LA CARD ==========
        console.log('🗑️ Étape 10: Suppression de la card');
        await test.step('Supprimer la tâche de l\'annonce', async () => {
            await deleteTask(page, modifiedTaskTitle);
            
            // Vérifier que la tâche a été supprimée
            const deletedTaskCard = page.locator(`text=${modifiedTaskTitle}`);
            await expect(deletedTaskCard).toHaveCount(0);
            console.log('✅ Tâche supprimée de l\'annonce');
        });

        // ========== WORKFLOW ANNONCE TERMINÉ ==========
        console.log('🎉 Workflow annonce terminé avec succès !');
        
        // Fermer le modal Kanban
        console.log('🔐 Fermeture du modal Kanban...');
        const closeSelectors = [
            'button:has(svg)',
            'button[title*="Fermer"]',
            'button:has-text("✕")',
            'button:has-text("×")', 
            '.hover\\:bg-gray-100',
            '[class*="text-gray-400"]:has(svg)'
        ];
        
        let modalClosed = false;
        for (const selector of closeSelectors) {
            try {
                const closeButton = page.locator(selector).first();
                if (await closeButton.isVisible({ timeout: 3000 })) {
                    await closeButton.click();
                    console.log(`   ✅ Modal fermé avec: ${selector}`);
                    modalClosed = true;
                    break;
                }
            } catch (error) {
                continue;
            }
        }
        
        if (!modalClosed) {
            await page.keyboard.press('Escape');
        }
        
        await page.waitForTimeout(2000);
        console.log('✅ Retour à la liste des annonces');

        // ========== ÉTAPE FINALE: DÉCONNEXION ==========
        console.log('🚪 Étape finale: Déconnexion');
        await test.step('Se déconnecter', async () => {
            await logout(page);
            console.log('✅ Déconnexion réussie');
        });

        console.log('🎉 WORKFLOW COMPLET TERMINÉ AVEC SUCCÈS ! 🎉');
    });

    test.afterEach(async ({ page }) => {
        console.log('🧹 Nettoyage post-test...');
        await page.close();
    });
});
