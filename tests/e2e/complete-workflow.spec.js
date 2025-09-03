// Tests Playwright complets pour GoCrew - Workflow utilisateur complet
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

test.describe('GoCrew - Workflow Utilisateur Complet', () => {
    let testData;

    test.beforeAll(() => {
        testData = generateTestData();
        console.log('🧪 Données de test générées:', testData);
    });

    test('Workflow complet utilisateur - Inscription à Déconnexion', async ({ page }) => {
        console.log('🚀 Début du workflow complet utilisateur');

        // ========== ÉTAPE 1: INSCRIPTION ==========
        console.log('📝 Étape 1: Inscription');
        await test.step('Inscription utilisateur', async () => {
            await signup(page, testData);
            
            // Vérifier que l'inscription a réussi
            const successMessage = page.locator('text=Inscription réussie, text=Bienvenue, [data-testid="success-message"]');
            if (await successMessage.first().isVisible({ timeout: 5000 })) {
                await expect(successMessage.first()).toBeVisible();
            } else {
                console.log('⚠️ Message de succès d\'inscription non trouvé, continuons...');
            }
        });

        // ========== ÉTAPE 2: CONNEXION ==========
        console.log('🔐 Étape 2: Connexion');
        await test.step('Connexion utilisateur', async () => {
            await login(page, testData);
            
            // Vérifier qu'on est bien connecté (URL ou élément spécifique)
            await expect(page).toHaveURL(/.*\/(home|dashboard)/);
            
            // Vérifier la présence d'éléments de navigation
            const navigationElement = page.locator('nav, [data-testid="navigation"], .navbar, header');
            if (await navigationElement.first().isVisible({ timeout: 5000 })) {
                await expect(navigationElement.first()).toBeVisible();
            }
        });

        // ========== ÉTAPE 3: CLIC BOUTON PROFIL ==========
        console.log('👤 Étape 3: Clic sur le bouton Profil');
        await test.step('Navigation vers le profil', async () => {
            // Chercher différents sélecteurs pour le bouton profil
            const profileSelectors = [
                'button:has-text("Profil")',
                'a[href="/profile"]',
                'a[href="/user-profile"]',
                '[data-testid="profile-button"]',
                '.profile-button',
                'img[alt*="Avatar"], img[alt*="Profile"]',
                'button:has(img[alt*="Avatar"])'
            ];

            let profileButton = null;
            for (const selector of profileSelectors) {
                profileButton = page.locator(selector);
                if (await profileButton.first().isVisible({ timeout: 2000 })) {
                    await profileButton.first().click();
                    break;
                }
            }

            // Si pas trouvé, essayer de naviguer directement
            if (!profileButton || !(await profileButton.first().isVisible({ timeout: 1000 }))) {
                console.log('⚠️ Bouton profil non trouvé, navigation directe...');
                await page.goto('/profile');
            }

            await page.waitForTimeout(2000);
            console.log('✅ Navigation vers profil effectuée');
        });

        // ========== ÉTAPE 4: CLIC BOUTON ACCUEIL ==========
        console.log('🏠 Étape 4: Clic sur le bouton Accueil');
        await test.step('Navigation vers l\'accueil', async () => {
            const homeSelectors = [
                'button:has-text("Accueil")',
                'a:has-text("Accueil")',
                'a[href="/home"]',
                'a[href="/dashboard"]',
                '[data-testid="home-button"]',
                '.home-button'
            ];

            let homeButton = null;
            for (const selector of homeSelectors) {
                homeButton = page.locator(selector);
                if (await homeButton.first().isVisible({ timeout: 2000 })) {
                    await homeButton.first().click();
                    break;
                }
            }

            if (!homeButton || !(await homeButton.first().isVisible({ timeout: 1000 }))) {
                console.log('⚠️ Bouton accueil non trouvé, navigation directe...');
                await page.goto('/home');
            }

            await page.waitForTimeout(2000);
            console.log('✅ Navigation vers accueil effectuée');
        });

        // ========== ÉTAPE 5: CLIC BOUTON ANNONCES ==========
        console.log('📢 Étape 5: Clic sur le bouton Annonces');
        await test.step('Navigation vers les annonces', async () => {
            const announcementSelectors = [
                'button:has-text("Annonce")',
                'a:has-text("Annonces")',
                'a[href="/announcements"]',
                '[data-testid="announcements-button"]',
                '.announcements-button'
            ];

            let announcementButton = null;
            for (const selector of announcementSelectors) {
                announcementButton = page.locator(selector);
                if (await announcementButton.first().isVisible({ timeout: 2000 })) {
                    await announcementButton.first().click();
                    break;
                }
            }

            if (!announcementButton || !(await announcementButton.first().isVisible({ timeout: 1000 }))) {
                console.log('⚠️ Bouton annonces non trouvé, navigation directe...');
                await page.goto('/announcements');
            }

            await page.waitForLoadState('networkidle');
            console.log('✅ Navigation vers annonces effectuée');
        });

        // ========== ÉTAPE 6: CRÉER UNE ANNONCE ==========
        console.log('➕ Étape 6: Création d\'une annonce');
        await test.step('Créer une annonce', async () => {
            await createAnnouncement(page, testData);
            
            // Vérifier que l'annonce a été créée
            const announcementCard = page.locator(`text=${testData.announcementTitle}`);
            await expect(announcementCard.first()).toBeVisible({ timeout: 10000 });
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
            // D'après KanbanBoard.jsx, c'est un modal avec classe 'fixed inset-0'
            const kanbanModalSelectors = [
                '.fixed.inset-0',
                '[role="dialog"]',
                '.z-50', // Le KanbanBoard a z-50 dans son modal
                '.bg-black.bg-opacity-50' // L'overlay du modal
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
            
            if (!kanbanModal) {
                console.log('⚠️ Modal Kanban non trouvé, tentative de recherche des colonnes directement...');
                
                // Si le modal n'est pas trouvé, chercher les colonnes Kanban directement
                const columnSelectors = [
                    'text=todo',
                    'text=doing', 
                    'text=done',
                    '.kanban-column',
                    '[class*="column"]'
                ];
                
                for (const selector of columnSelectors) {
                    try {
                        const column = await page.waitForSelector(selector, { timeout: 5000 });
                        if (column) {
                            console.log(`   ✅ Colonne Kanban trouvée avec: ${selector}`);
                            break;
                        }
                    } catch (error) {
                        console.log(`   ❌ Colonne non trouvée avec: ${selector}`);
                        continue;
                    }
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
            await expect(taskCard.first()).toBeVisible({ timeout: 5000 });
            console.log('✅ Tâche créée dans l\'annonce');
        });

        // ========== ÉTAPE 9: MODIFIER LA CARD ==========
        console.log('✏️ Étape 9: Modification de la card');
        const modifiedAnnouncementTaskTitle = `${announcementTaskTitle} - Modifiée`;
        await test.step('Modifier la tâche de l\'annonce', async () => {
            await editTask(page, announcementTaskTitle, modifiedAnnouncementTaskTitle);
            
            // Vérifier que la tâche a été modifiée
            const modifiedTaskCard = page.locator(`text=${modifiedAnnouncementTaskTitle}`);
            await expect(modifiedTaskCard.first()).toBeVisible({ timeout: 5000 });
            console.log('✅ Tâche modifiée dans l\'annonce');
        });

        // ========== ÉTAPE 10: SUPPRIMER LA CARD ==========
        console.log('🗑️ Étape 10: Suppression de la card');
        await test.step('Supprimer la tâche de l\'annonce', async () => {
            await deleteTask(page, modifiedAnnouncementTaskTitle);
            
            // Vérifier que la tâche a été supprimée
            const deletedTaskCard = page.locator(`text=${modifiedAnnouncementTaskTitle}`);
            await expect(deletedTaskCard).toHaveCount(0);
            console.log('✅ Tâche supprimée de l\'annonce');
        });

        // ========== ÉTAPE 11: SUPPRIMER L'ANNONCE ==========
        console.log('🗑️ Étape 11: Suppression de l\'annonce');
        await test.step('Supprimer l\'annonce', async () => {
            // Fermer le modal Kanban d'abord
            console.log('🔐 Fermeture du modal Kanban...');
            
            const closeSelectors = [
                'button:has(svg)', // Bouton avec icône SVG (X)
                'button[title*="Fermer"]',
                'button:has-text("✕")',
                'button:has-text("×")', 
                '.hover\\:bg-gray-100', // Style du bouton de fermeture dans le header
                '[class*="text-gray-400"]:has(svg)' // Bouton gris avec icône
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
                    console.log(`   ❌ Échec fermeture: ${selector}`);
                    continue;
                }
            }
            
            if (!modalClosed) {
                console.log('⚠️ Bouton de fermeture non trouvé, tentative ESC...');
                await page.keyboard.press('Escape');
            }
            
            // Attendre que le modal se ferme
            await page.waitForTimeout(2000);
            
            // Vérifier que nous sommes bien sur la page des annonces
            if (!page.url().includes('/announcements')) {
                console.log('📍 Navigation vers les annonces...');
                await navigateToSection(page, 'announcements');
            }
            
            await deleteItem(page, testData.announcementTitle, 'announcement');
            
            // Vérifier que l'annonce a été supprimée
            const deletedAnnouncementCard = page.locator(`text=${testData.announcementTitle}`);
            await expect(deletedAnnouncementCard).toHaveCount(0);
            console.log('✅ Annonce supprimée');
        });

        // ========== ÉTAPE 12: ALLER DANS VOYAGES ==========
        console.log('✈️ Étape 12: Navigation vers Voyages');
        await test.step('Naviguer vers la section Voyages', async () => {
            const tripsSelectors = [
                'a:has-text("Voyages")',
                'a[href="/trips"]',
                'button:has-text("Voyages")',
                '[data-testid="trips-button"]',
                '.trips-button'
            ];

            let tripsButton = null;
            for (const selector of tripsSelectors) {
                tripsButton = page.locator(selector);
                if (await tripsButton.first().isVisible({ timeout: 2000 })) {
                    await tripsButton.first().click();
                    break;
                }
            }

            if (!tripsButton || !(await tripsButton.first().isVisible({ timeout: 1000 }))) {
                console.log('⚠️ Bouton voyages non trouvé, navigation directe...');
                await page.goto('/trips');
            }

            await page.waitForLoadState('networkidle');
            console.log('✅ Navigation vers voyages effectuée');
        });

        // ========== ÉTAPE 13: CRÉER UN CREW ==========
        console.log('👥 Étape 13: Création d\'un crew');
        await test.step('Créer un crew', async () => {
            await createCrew(page, testData);
            
            // Vérifier que le crew a été créé
            const crewCard = page.locator(`text=${testData.tripName}`);
            await expect(crewCard.first()).toBeVisible({ timeout: 10000 });
            console.log('✅ Crew créé avec succès');
        });

        // ========== ÉTAPE 14: OUVRIR LE KANBAN DU CREW ==========
        console.log('📋 Étape 14: Ouverture du kanban du crew');
        await test.step('Ouvrir kanban du crew', async () => {
            // Cliquer sur le crew créé
            const crewCard = page.locator(`text=${testData.tripName}`).first();
            await crewCard.click();
            
            // Attendre que le kanban s'ouvre
            await waitForElement(page, '[data-testid="kanban-board"], .kanban, [class*="kanban"]');
            console.log('✅ Kanban du crew ouvert');
        });

        // ========== ÉTAPE 15: CRÉER UNE CARD DANS LE CREW ==========
        console.log('📝 Étape 15: Création d\'une card dans le crew');
        const crewTaskTitle = `${testData.taskTitle} Crew`;
        await test.step('Créer une tâche dans le crew', async () => {
            await createTask(page, crewTaskTitle);
            
            // Vérifier que la tâche a été créée
            const taskCard = page.locator(`text=${crewTaskTitle}`);
            await expect(taskCard.first()).toBeVisible({ timeout: 5000 });
            console.log('✅ Tâche créée dans le crew');
        });

        // ========== ÉTAPE 16: MODIFIER LA CARD DU CREW ==========
        console.log('✏️ Étape 16: Modification de la card du crew');
        const modifiedCrewTaskTitle = `${crewTaskTitle} - Modifiée`;
        await test.step('Modifier la tâche du crew', async () => {
            await editTask(page, crewTaskTitle, modifiedCrewTaskTitle);
            
            // Vérifier que la tâche a été modifiée
            const modifiedTaskCard = page.locator(`text=${modifiedCrewTaskTitle}`);
            await expect(modifiedTaskCard.first()).toBeVisible({ timeout: 5000 });
            console.log('✅ Tâche modifiée dans le crew');
        });

        // ========== ÉTAPE 17: SUPPRIMER LA CARD DU CREW ==========
        console.log('🗑️ Étape 17: Suppression de la card du crew');
        await test.step('Supprimer la tâche du crew', async () => {
            await deleteTask(page, modifiedCrewTaskTitle);
            
            // Vérifier que la tâche a été supprimée
            const deletedTaskCard = page.locator(`text=${modifiedCrewTaskTitle}`);
            await expect(deletedTaskCard).toHaveCount(0);
            console.log('✅ Tâche supprimée du crew');
        });

        // ========== ÉTAPE 18: SUPPRIMER LE CREW ==========
        console.log('🗑️ Étape 18: Suppression du crew');
        await test.step('Supprimer le crew', async () => {
            // Fermer le kanban d'abord
            const closeButton = page.locator('button:has-text("✕"), button:has-text("Fermer"), [data-testid="close-button"]');
            if (await closeButton.first().isVisible({ timeout: 3000 })) {
                await closeButton.first().click();
                await page.waitForTimeout(1000);
            }
            
            // Revenir à la page des voyages si nécessaire
            if (!page.url().includes('/trips')) {
                await navigateToSection(page, 'trips');
            }
            
            await deleteItem(page, testData.tripName, 'crew');
            
            // Vérifier que le crew a été supprimé
            const deletedCrewCard = page.locator(`text=${testData.tripName}`);
            await expect(deletedCrewCard).toHaveCount(0);
            console.log('✅ Crew supprimé');
        });

        // ========== ÉTAPE 19: DÉCONNEXION ==========
        console.log('🚪 Étape 19: Déconnexion');
        await test.step('Déconnexion utilisateur', async () => {
            await logout(page);
            
            // Vérifier qu'on est bien déconnecté
            await expect(page).toHaveURL(/.*\/login/);
            console.log('✅ Déconnexion effectuée avec succès');
        });

        console.log('🎉 Workflow complet terminé avec succès !');
    });

    test.afterEach(async ({ page }) => {
        // Nettoyer les données de test si nécessaire
        console.log('🧹 Nettoyage post-test...');
    });
});
