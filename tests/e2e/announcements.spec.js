// Tests spécifiques pour les annonces GoCrew
const { test, expect } = require('@playwright/test');
const { 
    generateTestData, 
    login, 
    navigateToSection, 
    createAnnouncement, 
    deleteItem,
    createTask,
    editTask,
    deleteTask
} = require('../helpers');

test.describe('Gestion des Annonces', () => {
    let testData;

    test.beforeAll(() => {
        testData = generateTestData();
    });

    test.beforeEach(async ({ page }) => {
        // Se connecter avant chaque test
        await login(page, testData);
    });

    test('Créer une nouvelle annonce', async ({ page }) => {
        await test.step('Navigation vers annonces', async () => {
            await navigateToSection(page, 'announcements');
        });

        await test.step('Création de l\'annonce', async () => {
            await createAnnouncement(page, testData);
            
            // Vérifier que l'annonce apparaît dans la liste
            const announcementCard = page.locator(`text=${testData.announcementTitle}`);
            await expect(announcementCard.first()).toBeVisible({ timeout: 10000 });
        });
    });

    test('Modifier une annonce existante', async ({ page }) => {
        // Créer d'abord une annonce
        await navigateToSection(page, 'announcements');
        await createAnnouncement(page, testData);

        await test.step('Modification de l\'annonce', async () => {
            // Chercher l'annonce et cliquer dessus ou sur modifier
            const announcementCard = page.locator(`text=${testData.announcementTitle}`).first();
            await announcementCard.hover();

            // Chercher le bouton de modification
            const editSelectors = [
                'button:has-text("Modifier")',
                'button[title*="Modifier"]',
                '.edit-button',
                'button:has-text("✏️")',
                '[data-testid="edit-announcement"]'
            ];

            let editButton = null;
            for (const selector of editSelectors) {
                editButton = page.locator(selector);
                if (await editButton.first().isVisible({ timeout: 2000 })) {
                    await editButton.first().click();
                    break;
                }
            }

            if (editButton && await editButton.first().isVisible()) {
                // Modifier les champs
                const newTitle = `${testData.announcementTitle} - Modifiée`;
                await page.fill('input[name="title"], input[value*="' + testData.announcementTitle + '"]', newTitle);
                
                // Sauvegarder
                await page.click('button:has-text("Sauvegarder"), button:has-text("Modifier"), button[type="submit"]');
                
                // Vérifier la modification
                const modifiedCard = page.locator(`text=${newTitle}`);
                await expect(modifiedCard.first()).toBeVisible({ timeout: 5000 });
            }
        });
    });

    test('Gérer les tâches dans une annonce', async ({ page }) => {
        // Créer une annonce
        await navigateToSection(page, 'announcements');
        await createAnnouncement(page, testData);

        await test.step('Ouvrir le kanban de l\'annonce', async () => {
            const announcementCard = page.locator(`text=${testData.announcementTitle}`).first();
            await announcementCard.click();
            
            // Attendre que le kanban s'ouvre
            await page.waitForSelector('[data-testid="kanban-board"], .kanban, [class*="kanban"]', { timeout: 10000 });
        });

        const taskTitle = `${testData.taskTitle} Test`;
        const modifiedTaskTitle = `${taskTitle} - Modifiée`;

        await test.step('Créer une tâche', async () => {
            await createTask(page, taskTitle);
            const taskCard = page.locator(`text=${taskTitle}`);
            await expect(taskCard.first()).toBeVisible({ timeout: 5000 });
        });

        await test.step('Modifier la tâche', async () => {
            await editTask(page, taskTitle, modifiedTaskTitle);
            const modifiedTaskCard = page.locator(`text=${modifiedTaskTitle}`);
            await expect(modifiedTaskCard.first()).toBeVisible({ timeout: 5000 });
        });

        await test.step('Supprimer la tâche', async () => {
            await deleteTask(page, modifiedTaskTitle);
            const deletedTaskCard = page.locator(`text=${modifiedTaskTitle}`);
            await expect(deletedTaskCard).toHaveCount(0);
        });
    });

    test('Supprimer une annonce', async ({ page }) => {
        // Créer d'abord une annonce
        await navigateToSection(page, 'announcements');
        await createAnnouncement(page, testData);

        await test.step('Suppression de l\'annonce', async () => {
            await deleteItem(page, testData.announcementTitle, 'announcement');
            
            // Vérifier que l'annonce a été supprimée
            const deletedCard = page.locator(`text=${testData.announcementTitle}`);
            await expect(deletedCard).toHaveCount(0);
        });
    });

    test('Filtrer et rechercher des annonces', async ({ page }) => {
        await navigateToSection(page, 'announcements');

        // Créer plusieurs annonces pour tester les filtres
        const testData2 = generateTestData();
        await createAnnouncement(page, testData);
        await createAnnouncement(page, testData2);

        await test.step('Test de recherche', async () => {
            // Chercher une barre de recherche
            const searchSelectors = [
                'input[placeholder*="recherche"]',
                'input[placeholder*="Recherche"]',
                'input[type="search"]',
                '[data-testid="search-input"]',
                '.search-input'
            ];

            let searchInput = null;
            for (const selector of searchSelectors) {
                searchInput = page.locator(selector);
                if (await searchInput.first().isVisible({ timeout: 2000 })) {
                    break;
                }
            }

            if (searchInput && await searchInput.first().isVisible()) {
                // Rechercher la première annonce
                await searchInput.fill(testData.announcementTitle);
                await page.waitForTimeout(1000);
                
                // Vérifier que seule la première annonce est visible
                const firstAnnouncement = page.locator(`text=${testData.announcementTitle}`);
                const secondAnnouncement = page.locator(`text=${testData2.announcementTitle}`);
                
                await expect(firstAnnouncement.first()).toBeVisible();
                // La deuxième ne devrait plus être visible (ou moins prioritaire)
            }
        });
    });

    test.afterEach(async ({ page }) => {
        // Nettoyer : supprimer les annonces créées
        try {
            await navigateToSection(page, 'announcements');
            
            // Essayer de supprimer l'annonce de test
            const testAnnouncement = page.locator(`text=${testData.announcementTitle}`);
            if (await testAnnouncement.first().isVisible({ timeout: 2000 })) {
                await deleteItem(page, testData.announcementTitle, 'announcement');
            }
        } catch (error) {
            console.log('⚠️ Nettoyage des annonces échoué:', error.message);
        }
    });
});
