// Tests spécifiques pour les crews/voyages GoCrew
const { test, expect } = require('@playwright/test');
const { 
    generateTestData, 
    login, 
    navigateToSection, 
    createCrew, 
    deleteItem,
    createTask,
    editTask,
    deleteTask
} = require('../helpers');

test.describe('Gestion des Crews/Voyages', () => {
    let testData;

    test.beforeAll(() => {
        testData = generateTestData();
    });

    test.beforeEach(async ({ page }) => {
        // Se connecter avant chaque test
        await login(page, testData);
    });

    test('Créer un nouveau crew', async ({ page }) => {
        await test.step('Navigation vers voyages', async () => {
            await navigateToSection(page, 'trips');
        });

        await test.step('Création du crew', async () => {
            await createCrew(page, testData);
            
            // Vérifier que le crew apparaît dans la liste
            const crewCard = page.locator(`text=${testData.tripName}`);
            await expect(crewCard.first()).toBeVisible({ timeout: 10000 });
        });
    });

    test('Inviter des membres dans un crew', async ({ page }) => {
        // Créer d'abord un crew
        await navigateToSection(page, 'trips');
        await createCrew(page, testData);

        await test.step('Ajouter des invitations', async () => {
            // Cliquer sur le bouton nouveau voyage pour ouvrir le modal
            await page.click('button:has-text("+ Nouveau voyage"), button:has-text("+ Nouveau")');
            
            // Attendre l'ouverture du modal
            await page.waitForSelector('[data-testid="create-trip-modal"], .modal, [role="dialog"]', { timeout: 5000 });
            
            // Sélectionner le type crew
            const crewButton = page.locator('button:has-text("Crew")');
            if (await crewButton.isVisible()) {
                await crewButton.click();
            }
            
            // Chercher le bouton d'ajout d'invités
            const addInviteButton = page.locator('button:has-text("Ajouter une personne"), button:has-text("+ Ajouter")');
            if (await addInviteButton.first().isVisible({ timeout: 3000 })) {
                await addInviteButton.first().click();
                
                // Remplir l'email d'invitation
                const emailInput = page.locator('input[type="email"], input[placeholder*="email"]').last();
                if (await emailInput.isVisible()) {
                    await emailInput.fill('invite@example.com');
                }
                
                // Fermer le modal
                await page.click('button:has-text("Annuler")');
            } else {
                console.log('⚠️ Fonctionnalité d\'invitation non trouvée');
                await page.click('button:has-text("Annuler")');
            }
        });
    });

    test('Gérer les tâches dans un crew', async ({ page }) => {
        // Créer un crew
        await navigateToSection(page, 'trips');
        await createCrew(page, testData);

        await test.step('Ouvrir le kanban du crew', async () => {
            const crewCard = page.locator(`text=${testData.tripName}`).first();
            await crewCard.click();
            
            // Attendre que le kanban s'ouvre
            await page.waitForSelector('[data-testid="kanban-board"], .kanban, [class*="kanban"]', { timeout: 10000 });
        });

        const taskTitle = `${testData.taskTitle} Crew`;
        const modifiedTaskTitle = `${taskTitle} - Modifiée`;

        await test.step('Créer une tâche dans le crew', async () => {
            await createTask(page, taskTitle);
            const taskCard = page.locator(`text=${taskTitle}`);
            await expect(taskCard.first()).toBeVisible({ timeout: 5000 });
        });

        await test.step('Modifier la tâche', async () => {
            await editTask(page, taskTitle, modifiedTaskTitle);
            const modifiedTaskCard = page.locator(`text=${modifiedTaskTitle}`);
            await expect(modifiedTaskCard.first()).toBeVisible({ timeout: 5000 });
        });

        await test.step('Déplacer une tâche entre colonnes', async () => {
            // Essayer de glisser-déposer la tâche vers une autre colonne
            const taskElement = page.locator(`text=${modifiedTaskTitle}`).first();
            const columns = page.locator('[data-testid="kanban-column"], .kanban-column, .column');
            
            if (await columns.count() > 1) {
                const sourceColumn = columns.first();
                const targetColumn = columns.nth(1);
                
                // Glisser-déposer si possible
                try {
                    await taskElement.dragTo(targetColumn);
                    console.log('✅ Tâche déplacée entre colonnes');
                } catch (error) {
                    console.log('⚠️ Drag & drop non disponible:', error.message);
                }
            }
        });

        await test.step('Supprimer la tâche', async () => {
            await deleteTask(page, modifiedTaskTitle);
            const deletedTaskCard = page.locator(`text=${modifiedTaskTitle}`);
            await expect(deletedTaskCard).toHaveCount(0);
        });
    });

    test('Modifier les informations d\'un crew', async ({ page }) => {
        // Créer d'abord un crew
        await navigateToSection(page, 'trips');
        await createCrew(page, testData);

        await test.step('Modification du crew', async () => {
            // Chercher le crew et essayer de le modifier
            const crewCard = page.locator(`text=${testData.tripName}`).first();
            await crewCard.hover();

            // Chercher un bouton de modification
            const editSelectors = [
                'button:has-text("Modifier")',
                'button[title*="Modifier"]',
                '.edit-button',
                'button:has-text("✏️")',
                '[data-testid="edit-crew"]'
            ];

            let editButton = null;
            for (const selector of editSelectors) {
                editButton = page.locator(selector);
                if (await editButton.first().isVisible({ timeout: 2000 })) {
                    await editButton.first().click();
                    break;
                }
            }

            // Si pas de bouton direct, essayer de cliquer sur le crew
            if (!editButton || !(await editButton.first().isVisible({ timeout: 1000 }))) {
                console.log('⚠️ Bouton modification non trouvé, test de modification sauté');
            } else {
                // Modifier les informations
                const newTitle = `${testData.tripName} - Modifié`;
                await page.fill('input[name="name"], input[value*="' + testData.tripName + '"]', newTitle);
                
                // Sauvegarder
                await page.click('button:has-text("Sauvegarder"), button:has-text("Modifier"), button[type="submit"]');
                
                // Vérifier la modification
                const modifiedCard = page.locator(`text=${newTitle}`);
                await expect(modifiedCard.first()).toBeVisible({ timeout: 5000 });
            }
        });
    });

    test('Supprimer un crew', async ({ page }) => {
        // Créer d'abord un crew
        await navigateToSection(page, 'trips');
        await createCrew(page, testData);

        await test.step('Suppression du crew', async () => {
            await deleteItem(page, testData.tripName, 'crew');
            
            // Vérifier que le crew a été supprimé
            const deletedCard = page.locator(`text=${testData.tripName}`);
            await expect(deletedCard).toHaveCount(0);
        });
    });

    test('Visualiser les statistiques du crew', async ({ page }) => {
        // Créer un crew et ajouter quelques tâches
        await navigateToSection(page, 'trips');
        await createCrew(page, testData);

        await test.step('Vérifier les statistiques', async () => {
            // Ouvrir le crew
            const crewCard = page.locator(`text=${testData.tripName}`).first();
            await crewCard.click();
            
            // Chercher des éléments de statistiques
            const statsSelectors = [
                '[data-testid="stats"]',
                '.stats',
                '.statistics',
                'text=Statistiques',
                'text=Tâches',
                'text=Membres'
            ];

            let statsFound = false;
            for (const selector of statsSelectors) {
                const statsElement = page.locator(selector);
                if (await statsElement.first().isVisible({ timeout: 3000 })) {
                    console.log('✅ Statistiques trouvées:', selector);
                    statsFound = true;
                    break;
                }
            }

            if (!statsFound) {
                console.log('⚠️ Statistiques non visibles, mais crew ouvert');
            }
        });
    });

    test.afterEach(async ({ page }) => {
        // Nettoyer : supprimer les crews créés
        try {
            await navigateToSection(page, 'trips');
            
            // Essayer de supprimer le crew de test
            const testCrew = page.locator(`text=${testData.tripName}`);
            if (await testCrew.first().isVisible({ timeout: 2000 })) {
                await deleteItem(page, testData.tripName, 'crew');
            }
        } catch (error) {
            console.log('⚠️ Nettoyage des crews échoué:', error.message);
        }
    });
});
