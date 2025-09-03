// Test helpers and utilities for GoCrew Playwright tests
const { expect } = require('@playwright/test');

/**
 * Génère des données de test uniques
 */
function generateTestData() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const uniqueId = `${timestamp}_${random}`;
    
    return {
        email: `testuser${uniqueId}@example.com`,
        username: `TestUser${uniqueId}`,
        password: 'TestPassword123!',
        tripName: `Voyage Test ${uniqueId}`,
        announcementTitle: `Annonce Test ${uniqueId}`,
        taskTitle: `Tâche Test ${uniqueId}`
    };
}

/**
 * Fonction d'inscription
 */
async function signup(page, testData) {
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    
    // Remplir le formulaire d'inscription
    await page.fill('input#name', testData.username);
    await page.fill('input#email', testData.email);
    await page.fill('input#password', testData.password);
    await page.fill('input[placeholder="****************"]:below(input#password)', testData.password);
    
    // Cliquer sur le bouton d'inscription
    await page.click('button:has-text("S\'inscrire")');
    
    // Attendre la confirmation ou redirection
    await page.waitForTimeout(2000);
}

/**
 * Fonction de connexion
 */
async function login(page, testData) {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Remplir le formulaire de connexion
    await page.fill('input#email', testData.email);
    await page.fill('input#password', testData.password);
    
    // Cliquer sur le bouton de connexion
    await page.click('button:has-text("Connexion")');
    
    // Attendre la redirection vers le dashboard
    await page.waitForURL('**/home', { timeout: 10000 });
}

/**
 * Fonction de déconnexion
 */
async function logout(page) {
    // Chercher le bouton de déconnexion
    const logoutButton = page.locator('button:has-text("Déconnexion")');
    if (await logoutButton.isVisible()) {
        await logoutButton.click();
    } else {
        // Alternative si le bouton n'est pas visible
        await page.click('[data-testid="logout-button"]');
    }
    
    // Attendre la redirection vers la page de login
    await page.waitForURL('**/login', { timeout: 5000 });
}

/**
 * Navigation vers une section spécifique
 */
async function navigateToSection(page, section) {
    const sectionMap = {
        'home': '/home',
        'profile': '/profile', 
        'announcements': '/announcements',
        'trips': '/trips'
    };
    
    if (sectionMap[section]) {
        await page.goto(sectionMap[section]);
        await page.waitForLoadState('networkidle');
    }
}

/**
 * Créer une annonce
 */
async function createAnnouncement(page, testData) {
    // Aller à la page des annonces
    await navigateToSection(page, 'announcements');
    
    // Cliquer sur le bouton "Nouveau" - utiliser différents sélecteurs possibles
    const newButtonSelectors = [
        'button:has-text("+ Nouveau")',
        'button:has-text("Nouveau")',
        'button:has-text("+ Ajouter")',
        'button:has-text("Créer")',
        '[data-testid="new-announcement-button"]'
    ];
    
    let buttonClicked = false;
    for (const selector of newButtonSelectors) {
        const button = page.locator(selector);
        if (await button.first().isVisible({ timeout: 2000 })) {
            await button.first().click();
            buttonClicked = true;
            break;
        }
    }
    
    if (!buttonClicked) {
        throw new Error('Bouton de création d\'annonce non trouvé');
    }
    
    // Attendre l'ouverture du modal avec différents sélecteurs
    const modalSelectors = [
        '[data-testid="create-announcement-modal"]',
        '.modal',
        '[role="dialog"]',
        'div:has(h2:text("Créer une annonce"))',
        'div:has(h2:text("annonce"))',
        '.bg-white.rounded-lg:has(h2)'
    ];
    
    let modalFound = false;
    for (const selector of modalSelectors) {
        try {
            await page.waitForSelector(selector, { timeout: 3000 });
            modalFound = true;
            break;
        } catch (error) {
            continue;
        }
    }
    
    if (!modalFound) {
        // Attendre un peu plus au cas où le modal met du temps à s'ouvrir
        await page.waitForTimeout(2000);
    }
    
    // Remplir le formulaire d'annonce avec différents sélecteurs
    const titleSelectors = [
        'input[name="title"]',
        'input[placeholder*="nom"]',
        'input[placeholder*="titre"]',
        'input[placeholder*="voyage"]'
    ];
    
    for (const selector of titleSelectors) {
        const input = page.locator(selector);
        if (await input.first().isVisible({ timeout: 1000 })) {
            await input.first().fill(testData.announcementTitle);
            break;
        }
    }
    
    const descriptionSelectors = [
        'textarea[name="description"]',
        'textarea[placeholder*="description"]',
        'textarea[placeholder*="projet"]'
    ];
    
    for (const selector of descriptionSelectors) {
        const textarea = page.locator(selector);
        if (await textarea.first().isVisible({ timeout: 1000 })) {
            await textarea.first().fill(`Description de ${testData.announcementTitle}`);
            break;
        }
    }
    
    const destinationSelectors = [
        'input[name="destination"]',
        'input[placeholder*="destination"]',
        'input[placeholder*="lieu"]'
    ];
    
    for (const selector of destinationSelectors) {
        const input = page.locator(selector);
        if (await input.first().isVisible({ timeout: 1000 })) {
            await input.first().fill('Paris, France');
            break;
        }
    }
    
    const budgetSelectors = [
        'input[name="budget"]',
        'input[placeholder*="budget"]',
        'input[type="number"]'
    ];
    
    for (const selector of budgetSelectors) {
        const input = page.locator(selector);
        if (await input.first().isVisible({ timeout: 1000 })) {
            await input.first().fill('500');
            break;
        }
    }
    
    // Remplir les dates si présentes
    const startDateInput = page.locator('input[name="start_date"], input[type="date"]').first();
    if (await startDateInput.isVisible({ timeout: 1000 })) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 7);
        await startDateInput.fill(tomorrow.toISOString().split('T')[0]);
    }
    
    const endDateInput = page.locator('input[name="end_date"], input[type="date"]').nth(1);
    if (await endDateInput.isVisible({ timeout: 1000 })) {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 14);
        await endDateInput.fill(nextWeek.toISOString().split('T')[0]);
    }
    
    // Soumettre le formulaire
    const submitSelectors = [
        'button[type="submit"]',
        'button:has-text("Créer")',
        'button:has-text("Publier")',
        'button:has-text("Créer l\'annonce")'
    ];
    
    for (const selector of submitSelectors) {
        const button = page.locator(selector);
        if (await button.first().isVisible({ timeout: 2000 })) {
            await button.first().click();
            break;
        }
    }
    
    // Attendre la fermeture du modal et le retour à la page
    await page.waitForTimeout(3000);
}

/**
 * Créer un crew/voyage
 */
async function createCrew(page, testData) {
    // Aller à la page des voyages
    await navigateToSection(page, 'trips');
    
    // Cliquer sur le bouton "Nouveau voyage" ou équivalent
    const newButtonSelectors = [
        'button:has-text("+ Nouveau voyage")',
        'button:has-text("+ Nouveau")',
        'button:has-text("Nouveau")',
        'button:has-text("Créer")',
        '[data-testid="new-trip-button"]'
    ];
    
    let buttonClicked = false;
    for (const selector of newButtonSelectors) {
        const button = page.locator(selector);
        if (await button.first().isVisible({ timeout: 2000 })) {
            await button.first().click();
            buttonClicked = true;
            break;
        }
    }
    
    if (!buttonClicked) {
        throw new Error('Bouton de création de voyage non trouvé');
    }
    
    // Attendre l'ouverture du modal
    const modalSelectors = [
        '[data-testid="create-trip-modal"]',
        '.modal',
        '[role="dialog"]',
        'div:has(h2:text("voyage"))',
        'div:has(h2:text("crew"))',
        '.bg-white.rounded-2xl:has(h2)'
    ];
    
    let modalFound = false;
    for (const selector of modalSelectors) {
        try {
            await page.waitForSelector(selector, { timeout: 3000 });
            modalFound = true;
            break;
        } catch (error) {
            continue;
        }
    }
    
    if (!modalFound) {
        await page.waitForTimeout(2000);
    }
    
    // Sélectionner le type crew si nécessaire (par défaut c'est crew)
    const crewButton = page.locator('button:has-text("Crew")');
    if (await crewButton.isVisible({ timeout: 2000 })) {
        await crewButton.click();
    }
    
    // Remplir le formulaire de crew
    const nameSelectors = [
        'input[name="name"]',
        'input[placeholder*="nom"]',
        'input[placeholder*="titre"]'
    ];
    
    for (const selector of nameSelectors) {
        const input = page.locator(selector);
        if (await input.first().isVisible({ timeout: 1000 })) {
            await input.first().fill(testData.tripName);
            break;
        }
    }
    
    const descriptionSelectors = [
        'textarea[name="description"]',
        'textarea[placeholder*="description"]'
    ];
    
    for (const selector of descriptionSelectors) {
        const textarea = page.locator(selector);
        if (await textarea.first().isVisible({ timeout: 1000 })) {
            await textarea.first().fill(`Description de ${testData.tripName}`);
            break;
        }
    }
    
    const destinationSelectors = [
        'input[name="destination"]',
        'input[placeholder*="destination"]'
    ];
    
    for (const selector of destinationSelectors) {
        const input = page.locator(selector);
        if (await input.first().isVisible({ timeout: 1000 })) {
            await input.first().fill('Tokyo, Japon');
            break;
        }
    }
    
    const budgetSelectors = [
        'input[name="budget"]',
        'input[placeholder*="budget"]',
        'input[type="number"]'
    ];
    
    for (const selector of budgetSelectors) {
        const input = page.locator(selector);
        if (await input.first().isVisible({ timeout: 1000 })) {
            await input.first().fill('1200');
            break;
        }
    }
    
    // Soumettre le formulaire
    const submitSelectors = [
        'button[type="submit"]',
        'button:has-text("Créer")',
        'button:has-text("Créer le crew")'
    ];
    
    for (const selector of submitSelectors) {
        const button = page.locator(selector);
        if (await button.first().isVisible({ timeout: 2000 })) {
            await button.first().click();
            break;
        }
    }
    
    // Attendre la fermeture du modal
    await page.waitForTimeout(3000);
}

/**
 * Créer une tâche/card dans le kanban
 */
async function createTask(page, taskTitle) {
    console.log(`🎯 Tentative de création de tâche: "${taskTitle}"`);
    
    // Attendre que le kanban modal soit stable
    await page.waitForTimeout(2000);
    
    // D'après KanbanBoard.jsx, le kanban a des colonnes avec des boutons "Ajouter rapidement"
    const quickAddButtonSelectors = [
        'button:has-text("Ajouter rapidement")',
        'button:has-text("+ Ajouter rapidement")', 
        'button:has-text("Ajouter")',
        'button:has(svg):has-text("Ajouter")',
        '.border-dashed:has-text("Ajouter")'
    ];
    
    console.log('🔍 Recherche des boutons "Ajouter rapidement"...');
    let quickAddButton = null;
    
    for (const selector of quickAddButtonSelectors) {
        try {
            const buttons = page.locator(selector);
            const count = await buttons.count();
            console.log(`   Trouvé ${count} boutons pour: ${selector}`);
            
            if (count > 0) {
                // Prendre le premier bouton (colonne "À faire")
                quickAddButton = buttons.first();
                if (await quickAddButton.isVisible({ timeout: 3000 })) {
                    console.log(`   ✅ Bouton trouvé avec: ${selector}`);
                    await quickAddButton.click();
                    break;
                }
            }
        } catch (error) {
            console.log(`   ❌ Échec avec: ${selector} - ${error.message}`);
            continue;
        }
    }
    
    if (!quickAddButton) {
        console.log('⚠️ Bouton "Ajouter rapidement" non trouvé, tentative avec bouton détails...');
        
        // Essayer le bouton "Ajouter avec détails"
        const detailButtonSelectors = [
            'button:has-text("Ajouter avec détails")',
            'button:has-text("+ Ajouter avec détails")',
            '.bg-\\[\\#FF6300\\]:has-text("Ajouter")',
            'button[style*="background"]:has-text("Ajouter")'
        ];
        
        for (const selector of detailButtonSelectors) {
            try {
                const detailButton = page.locator(selector).first();
                if (await detailButton.isVisible({ timeout: 3000 })) {
                    console.log(`   ✅ Bouton détails trouvé avec: ${selector}`);
                    await detailButton.click();
                    
                    // Remplir le modal de détails
                    await page.waitForTimeout(1000);
                    
                    const titleInput = page.locator('input[placeholder*="Ex: Réserver"], input[placeholder*="titre"], input[type="text"]').first();
                    if (await titleInput.isVisible({ timeout: 3000 })) {
                        await titleInput.fill(taskTitle);
                        
                        // Cliquer sur "Créer la tâche"
                        const createButton = page.locator('button:has-text("Créer la tâche")').first();
                        if (await createButton.isVisible({ timeout: 2000 })) {
                            await createButton.click();
                            console.log('✅ Tâche créée via modal détails');
                            return;
                        }
                    }
                    break;
                }
            } catch (error) {
                console.log(`   ❌ Échec bouton détails: ${selector} - ${error.message}`);
                continue;
            }
        }
        
        console.log('❌ Aucun bouton d\'ajout de tâche trouvé');
        return;
    }
    
    // Attendre que l'input d'ajout rapide apparaisse
    await page.waitForTimeout(1000);
    
    console.log('📝 Remplissage de l\'input de tâche...');
    const taskInputSelectors = [
        'input[placeholder*="Titre de la tâche"]',
        'input[placeholder*="titre"]',
        'input[placeholder*="tâche"]', 
        'input[type="text"]:visible',
        'input:focus', // L'input qui a le focus après le clic
        '.border-\\[\\#FF6300\\]' // Input avec bordure orange au focus
    ];
    
    let inputFilled = false;
    for (const selector of taskInputSelectors) {
        try {
            const input = page.locator(selector).first();
            if (await input.isVisible({ timeout: 2000 })) {
                await input.fill(taskTitle);
                console.log(`   ✅ Input rempli avec: ${selector}`);
                
                // Soumettre en appuyant sur Entrée ou cliquer sur "Ajouter"
                try {
                    await input.press('Enter');
                    console.log('   ✅ Soumission par Entrée');
                } catch (error) {
                    // Si Enter ne marche pas, chercher le bouton "Ajouter"
                    const submitButton = page.locator('button:has-text("Ajouter")').first();
                    if (await submitButton.isVisible({ timeout: 2000 })) {
                        await submitButton.click();
                        console.log('   ✅ Soumission par bouton');
                    }
                }
                inputFilled = true;
                break;
            }
        } catch (error) {
            console.log(`   ❌ Échec input: ${selector} - ${error.message}`);
            continue;
        }
    }
    
    if (!inputFilled) {
        console.log('❌ Impossible de remplir l\'input de tâche');
        return;
    }
    
    // Attendre que la tâche soit créée
    await page.waitForTimeout(2000);
    console.log('✅ Tâche créée avec succès');
}

/**
 * Modifier une card/tâche
 */
async function editTask(page, originalTitle, newTitle) {
    console.log(`🖊️ Tentative de modification de tâche: "${originalTitle}" → "${newTitle}"`);
    
    // Attendre un peu pour que les tâches soient rendues
    await page.waitForTimeout(2000);
    
    // D'après KanbanBoard.jsx, les tâches sont des div avec classe spécifique
    // Rechercher la tâche créée avec différents sélecteurs
    const taskSelectors = [
        `text=${originalTitle}`,
        `[class*="bg-white"]:has-text("${originalTitle}")`,
        `[class*="rounded"]:has-text("${originalTitle}")`,
        `[class*="shadow"]:has-text("${originalTitle}")`,
        `div:has-text("${originalTitle}")`,
        `h4:has-text("${originalTitle}")`, // Le titre est dans un h4 selon le composant
        `.font-semibold:has-text("${originalTitle}")`
    ];
    
    console.log('🔍 Recherche de la tâche à modifier...');
    let taskCard = null;
    
    for (const selector of taskSelectors) {
        try {
            const elements = page.locator(selector);
            const count = await elements.count();
            console.log(`   Trouvé ${count} éléments pour: ${selector}`);
            
            if (count > 0) {
                taskCard = elements.first();
                if (await taskCard.isVisible({ timeout: 3000 })) {
                    console.log(`   ✅ Tâche trouvée avec: ${selector}`);
                    break;
                }
            }
        } catch (error) {
            console.log(`   ❌ Échec avec: ${selector} - ${error.message}`);
            continue;
        }
    }
    
    if (!taskCard) {
        console.log('❌ Tâche non trouvée pour modification');
        return;
    }
    
    // D'après le KanbanBoard, cliquer sur une tâche ouvre le modal d'édition
    console.log('👆 Clic sur la tâche...');
    await taskCard.click();
    
    // Attendre que le modal d'édition s'ouvre (TaskEditModal)
    await page.waitForTimeout(2000);
    
    // Rechercher le champ titre dans le modal d'édition
    const titleInputSelectors = [
        'input[value*="' + originalTitle + '"]',
        'input[placeholder*="titre"]',
        'input[placeholder*="Titre"]',
        'input[name="title"]',
        'input[type="text"]', // Input de titre dans le modal
        'textarea[value*="' + originalTitle + '"]'
    ];
    
    console.log('📝 Recherche du champ titre dans le modal...');
    let titleInput = null;
    
    for (const selector of titleInputSelectors) {
        try {
            titleInput = page.locator(selector).first();
            if (await titleInput.isVisible({ timeout: 3000 })) {
                console.log(`   ✅ Champ titre trouvé avec: ${selector}`);
                break;
            }
        } catch (error) {
            console.log(`   ❌ Échec champ titre: ${selector} - ${error.message}`);
            continue;
        }
    }
    
    if (!titleInput) {
        console.log('❌ Champ titre non trouvé dans le modal');
        return;
    }
    
    // Modifier le titre
    await titleInput.click({ clickCount: 3 }); // Triple-clic pour sélectionner tout
    await titleInput.fill(newTitle);
    console.log(`   ✅ Titre modifié: "${newTitle}"`);
    
    // Sauvegarder les modifications
    const saveButtonSelectors = [
        'button:has-text("Sauvegarder")',
        'button:has-text("Enregistrer")',
        'button:has-text("Modifier")',
        'button:has-text("Valider")',
        'button[type="submit"]',
        '.bg-\\[\\#FF6300\\]' // Bouton orange de sauvegarde
    ];
    
    console.log('💾 Recherche du bouton de sauvegarde...');
    for (const selector of saveButtonSelectors) {
        try {
            const saveButton = page.locator(selector).first();
            if (await saveButton.isVisible({ timeout: 3000 })) {
                await saveButton.click();
                console.log(`   ✅ Sauvegarde effectuée avec: ${selector}`);
                break;
            }
        } catch (error) {
            console.log(`   ❌ Échec sauvegarde: ${selector} - ${error.message}`);
            continue;
        }
    }
    
    // Attendre que le modal se ferme et que les changements soient appliqués
    await page.waitForTimeout(2000);
    console.log('✅ Modification de tâche terminée');
}

/**
 * Supprimer une card/tâche
 */
async function deleteTask(page, taskTitle) {
    console.log(`🗑️ Tentative de suppression de tâche: "${taskTitle}"`);
    
    // Attendre un peu pour que les tâches soient mises à jour
    await page.waitForTimeout(2000);
    
    // D'après le KanbanBoard.jsx, chaque tâche a un bouton de suppression avec icône X
    // Rechercher la tâche avec différents sélecteurs
    const taskSelectors = [
        `text=${taskTitle}`,
        `[class*="bg-white"]:has-text("${taskTitle}")`,
        `[class*="rounded"]:has-text("${taskTitle}")`,
        `[class*="shadow"]:has-text("${taskTitle}")`,
        `div:has-text("${taskTitle}")`,
        `h4:has-text("${taskTitle}")`,
        `.font-semibold:has-text("${taskTitle}")`
    ];
    
    console.log('🔍 Recherche de la tâche à supprimer...');
    let taskCard = null;
    
    for (const selector of taskSelectors) {
        try {
            const elements = page.locator(selector);
            const count = await elements.count();
            console.log(`   Trouvé ${count} éléments pour: ${selector}`);
            
            if (count > 0) {
                taskCard = elements.first();
                if (await taskCard.isVisible({ timeout: 3000 })) {
                    console.log(`   ✅ Tâche trouvée avec: ${selector}`);
                    break;
                }
            }
        } catch (error) {
            console.log(`   ❌ Échec avec: ${selector} - ${error.message}`);
            continue;
        }
    }
    
    if (!taskCard) {
        console.log('❌ Tâche non trouvée pour suppression');
        return;
    }
    
    // Rechercher le bouton de suppression dans la tâche
    // D'après KanbanBoard.jsx, c'est un bouton avec icône X
    console.log('🔍 Recherche du bouton de suppression...');
    
    const deleteButtonSelectors = [
        `${taskCard._selector} button[title*="Supprimer"]`, // Bouton avec title="Supprimer la tâche"
        `${taskCard._selector} button:has(svg)`, // Boutons avec des icônes SVG 
        `${taskCard._selector} .text-gray-400.hover\\:text-red-500`, // Style du bouton de suppression
        `button:has-text("✕")`, // Bouton avec X
        `button[title*="Supprimer"]`, // Global
        `.hover\\:text-red-500`
    ];
    
    // Aussi essayer de trouver le bouton en survolant la tâche (hover)
    await taskCard.hover();
    await page.waitForTimeout(500);
    
    let deleteButton = null;
    for (const selector of deleteButtonSelectors) {
        try {
            deleteButton = page.locator(selector).first();
            if (await deleteButton.isVisible({ timeout: 2000 })) {
                console.log(`   ✅ Bouton suppression trouvé avec: ${selector}`);
                await deleteButton.click();
                break;
            }
        } catch (error) {
            console.log(`   ❌ Échec bouton suppression: ${selector} - ${error.message}`);
            continue;
        }
    }
    
    if (!deleteButton) {
        console.log('⚠️ Bouton de suppression directe non trouvé, tentative par modal...');
        
        // Si pas de bouton direct, ouvrir le modal d'édition et supprimer depuis là
        await taskCard.click();
        await page.waitForTimeout(2000);
        
        // Rechercher un bouton "Supprimer" dans le modal TaskEditModal
        const modalDeleteSelectors = [
            'button:has-text("Supprimer")',
            'button:has-text("Supprimer la tâche")',
            'button:has-text("Supprimer cette tâche")',
            '.text-red-600:has-text("Supprimer")',
            'button[class*="red"]:has-text("Supprimer")'
        ];
        
        for (const selector of modalDeleteSelectors) {
            try {
                const modalDeleteButton = page.locator(selector).first();
                if (await modalDeleteButton.isVisible({ timeout: 3000 })) {
                    await modalDeleteButton.click();
                    console.log(`   ✅ Suppression via modal avec: ${selector}`);
                    
                    // Confirmer la suppression si une confirmation apparaît
                    await page.waitForTimeout(1000);
                    const confirmButton = page.locator('button:has-text("Confirmer"), button:has-text("Oui"), button:has-text("Supprimer")').first();
                    if (await confirmButton.isVisible({ timeout: 2000 })) {
                        await confirmButton.click();
                        console.log('   ✅ Confirmation de suppression');
                    }
                    break;
                }
            } catch (error) {
                console.log(`   ❌ Échec suppression modal: ${selector} - ${error.message}`);
                continue;
            }
        }
    }
    
    // Attendre que la tâche soit supprimée
    await page.waitForTimeout(2000);
    console.log('✅ Suppression de tâche terminée');
}

/**
 * Supprimer une annonce ou un crew
 */
async function deleteItem(page, itemName, itemType = 'announcement') {
    console.log(`🗑️ Tentative de suppression de ${itemType}: "${itemName}"`);
    
    // Attendre un peu que la page se charge
    await page.waitForTimeout(2000);
    
    // Rechercher l'élément avec différents sélecteurs selon le type
    let itemSelectors;
    if (itemType === 'announcement') {
        // D'après CardAnnouncement.jsx, les annonces sont dans des div avec classe spécifique
        itemSelectors = [
            `text=${itemName}`,
            `[class*="bg-white"]:has-text("${itemName}")`,
            `[class*="rounded"]:has-text("${itemName}")`,
            `[class*="shadow"]:has-text("${itemName}")`,
            `[class*="card"]:has-text("${itemName}")`,
            `.cursor-pointer:has-text("${itemName}")`,
            `h3:has-text("${itemName}")`, // Le titre est dans un h3
            `.font-bold:has-text("${itemName}")`
        ];
    } else {
        // Pour les crews
        itemSelectors = [
            `[data-testid="${itemType}-card"]:has-text("${itemName}")`,
            `.${itemType}-card:has-text("${itemName}")`,
            `.card:has-text("${itemName}")`
        ];
    }
    
    console.log(`🔍 Recherche de ${itemType} à supprimer...`);
    let itemCard = null;
    
    for (const selector of itemSelectors) {
        try {
            const elements = page.locator(selector);
            const count = await elements.count();
            console.log(`   Trouvé ${count} éléments pour: ${selector}`);
            
            if (count > 0) {
                itemCard = elements.first();
                if (await itemCard.isVisible({ timeout: 3000 })) {
                    console.log(`   ✅ ${itemType} trouvé avec: ${selector}`);
                    break;
                }
            }
        } catch (error) {
            console.log(`   ❌ Échec avec: ${selector} - ${error.message}`);
            continue;
        }
    }
    
    if (!itemCard) {
        console.log(`❌ ${itemType} non trouvé pour suppression`);
        return;
    }
    
    // Faire un clic droit pour voir le menu contextuel ou chercher un bouton de suppression
    console.log(`🔍 Recherche du bouton de suppression...`);
    
    // D'abord essayer de survoler pour voir si des boutons apparaissent
    await itemCard.hover();
    await page.waitForTimeout(500);
    
    const deleteButtonSelectors = [
        'button:has-text("Supprimer")',
        'button[title*="Supprimer"]',
        'button[title*="upprimer"]', 
        '.delete-button',
        'button:has-text("🗑")',
        'button:has-text("✕")',
        '[class*="red"]:has-text("Supprimer")'
    ];
    
    let deleteButton = null;
    for (const selector of deleteButtonSelectors) {
        try {
            deleteButton = page.locator(selector).first();
            if (await deleteButton.isVisible({ timeout: 2000 })) {
                console.log(`   ✅ Bouton suppression trouvé avec: ${selector}`);
                await deleteButton.click();
                break;
            }
        } catch (error) {
            console.log(`   ❌ Échec bouton suppression: ${selector}`);
            continue;
        }
    }
    
    if (!deleteButton) {
        console.log('⚠️ Bouton de suppression non trouvé, tentative menu contextuel...');
        
        // Essayer un clic droit pour menu contextuel
        await itemCard.click({ button: 'right' });
        await page.waitForTimeout(1000);
        
        // Chercher "Supprimer" dans le menu contextuel
        for (const selector of deleteButtonSelectors) {
            try {
                const contextDeleteButton = page.locator(selector).first();
                if (await contextDeleteButton.isVisible({ timeout: 2000 })) {
                    await contextDeleteButton.click();
                    console.log(`   ✅ Suppression via menu contextuel avec: ${selector}`);
                    break;
                }
            } catch (error) {
                continue;
            }
        }
    }
    
    // Confirmer la suppression si une boîte de dialogue apparaît
    console.log('🔍 Recherche de confirmation de suppression...');
    await page.waitForTimeout(1000);
    
    const confirmSelectors = [
        'button:has-text("Confirmer")',
        'button:has-text("Oui")',
        'button:has-text("Supprimer")',
        'button:has-text("Valider")',
        '.text-red-600', // Bouton rouge de confirmation
        '[class*="red"]:has-text("Supprimer")'
    ];
    
    for (const selector of confirmSelectors) {
        try {
            const confirmButton = page.locator(selector).first();
            if (await confirmButton.isVisible({ timeout: 2000 })) {
                await confirmButton.click();
                console.log(`   ✅ Confirmation avec: ${selector}`);
                break;
            }
        } catch (error) {
            continue;
        }
    }
    
    await page.waitForTimeout(2000);
    console.log(`✅ Suppression de ${itemType} terminée`);
}

/**
 * Attendre qu'un élément soit visible avec retry
 */
async function waitForElement(page, selector, options = {}) {
    const defaultOptions = { timeout: 10000, ...options };
    return await page.waitForSelector(selector, defaultOptions);
}

module.exports = {
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
};
