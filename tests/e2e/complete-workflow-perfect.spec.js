import { test, expect } from '@playwright/test';
import { 
    generateTestData,
    signup, 
    login, 
    navigateToSection, 
    createAnnouncement,
    createTask,
    editTask,
    deleteTask 
} from '../helpers.js';

test.describe('GoCrew - Workflow Utilisateur Parfait', () => {

    test('Workflow complet utilisateur - De l\'inscription au management de tâches', async ({ page }) => {
        // Génération des données de test
        const testData = generateTestData();
        console.log('🧪 Données de test générées:', testData);
        
        console.log('🚀 Début du workflow complet utilisateur');
        
        // ÉTAPE 1: Inscription
        console.log('📝 Étape 1: Inscription');
        await signup(page, testData);
        console.log('✅ Inscription terminée');

        // ÉTAPE 2: Connexion
        console.log('🔐 Étape 2: Connexion');
        await login(page, testData);
        console.log('✅ Connexion réussie');

        // ÉTAPE 3: Clic sur le bouton Profil
        console.log('👤 Étape 3: Clic sur le bouton Profil');
        await navigateToSection(page, 'profil');
        console.log('✅ Navigation vers profil effectuée');

        // ÉTAPE 4: Clic sur le bouton Accueil
        console.log('🏠 Étape 4: Clic sur le bouton Accueil');
        await navigateToSection(page, 'accueil');
        console.log('✅ Navigation vers accueil effectuée');

        // ÉTAPE 5: Clic sur le bouton Annonces
        console.log('📢 Étape 5: Clic sur le bouton Annonces');
        await navigateToSection(page, 'annonces');
        console.log('✅ Navigation vers annonces effectuée');

        await test.step('Créer une annonce', async () => {
            console.log('➕ Étape 6: Création d\'une annonce');
            await createAnnouncement(page, testData);
            console.log('✅ Annonce créée avec succès');
        });

        await test.step('Ouvrir le kanban de l\'annonce', async () => {
            console.log('📋 Étape 7: Ouverture du kanban de l\'annonce');
            
            // Attendre que la page se charge complètement
            await page.waitForLoadState('networkidle');
            
            // Trouver et cliquer sur la carte d'annonce avec gestion de multiple éléments
            const announcementSelectors = [
                `text=${testData.announcementTitle}`,
                `[class*="bg-white"]:has-text("${testData.announcementTitle}")`,
                `[class*="rounded"]:has-text("${testData.announcementTitle}")`,
                `[class*="shadow"]:has-text("${testData.announcementTitle}")`,
                `[class*="card"]:has-text("${testData.announcementTitle}")`,
                `.cursor-pointer:has-text("${testData.announcementTitle}")`,
                `h3:has-text("${testData.announcementTitle}")`,
                `.font-bold:has-text("${testData.announcementTitle}")`
            ];
            
            let announcementCard = null;
            for (const selector of announcementSelectors) {
                try {
                    const elements = page.locator(selector);
                    const count = await elements.count();
                    console.log(`   Trouvé ${count} éléments pour: ${selector}`);
                    
                    if (count > 0) {
                        announcementCard = elements.first();
                        if (await announcementCard.isVisible({ timeout: 3000 })) {
                            console.log(`   ✅ Carte d'annonce trouvée avec: ${selector}`);
                            break;
                        }
                    }
                } catch (error) {
                    console.log(`   ❌ Sélecteur ${selector} échoué: ${error.message}`);
                }
            }
            
            if (!announcementCard) {
                throw new Error(`Impossible de trouver la carte d'annonce: ${testData.announcementTitle}`);
            }
            
            await announcementCard.click();
            console.log('✅ Clic sur la carte d\'annonce effectué');
            
            // Attendre que le modal Kanban s'ouvre
            const kanbanModal = page.locator('.fixed.inset-0');
            await expect(kanbanModal).toBeVisible({ timeout: 10000 });
            console.log('   ✅ Modal Kanban trouvé avec: .fixed.inset-0');
            console.log('✅ Kanban de l\'annonce ouvert');
        });

        await test.step('Créer une tâche dans l\'annonce', async () => {
            console.log('📝 Étape 8: Création d\'une card dans l\'annonce');
            const taskTitle = `${testData.taskTitle} Annonce`;
            await createTask(page, taskTitle);
            console.log('✅ Tâche créée dans l\'annonce');
        });

        await test.step('Modifier la tâche de l\'annonce', async () => {
            console.log('✏️ Étape 9: Modification de la card');
            const originalTitle = `${testData.taskTitle} Annonce`;
            const newTitle = `${testData.taskTitle} Annonce - Modifiée`;
            await editTask(page, originalTitle, newTitle);
            console.log('✅ Tâche modifiée dans l\'annonce');
        });

        await test.step('Supprimer la tâche de l\'annonce', async () => {
            console.log('🗑️ Étape 10: Suppression de la card');
            const taskTitle = `${testData.taskTitle} Annonce - Modifiée`;
            await deleteTask(page, taskTitle);
            console.log('✅ Tâche supprimée de l\'annonce');
        });

        console.log('🎉 Workflow annonce terminé avec succès !');
        
        // Fermer le modal Kanban proprement
        console.log('🔐 Fermeture du modal Kanban...');
        const closeButton = page.locator('button:has(svg)').first();
        if (await closeButton.isVisible()) {
            await closeButton.click();
            console.log('   ✅ Modal fermé avec: button:has(svg)');
        }
        
        // Attendre un peu pour s'assurer que le modal est fermé
        await page.waitForTimeout(1000);
        console.log('✅ Retour à la liste des annonces');
        
        console.log('🎊 WORKFLOW PARFAIT TERMINÉ - TOUTES LES 10 ÉTAPES RÉUSSIES !');
        console.log('📊 Résumé des fonctionnalités testées avec succès:');
        console.log('   ✅ Inscription avec génération d\'utilisateur unique');
        console.log('   ✅ Connexion JWT authentifiée');
        console.log('   ✅ Navigation complète (Profil → Accueil → Annonces)');
        console.log('   ✅ Création d\'annonce via modal');
        console.log('   ✅ Ouverture de Kanban modal');
        console.log('   ✅ Création de tâche via "Ajouter rapidement"');
        console.log('   ✅ Modification de tâche via modal TaskEdit');
        console.log('   ✅ Suppression de tâche via bouton hover');
        console.log('   ✅ Gestion complète des modals et interactions UI');
        console.log('   ✅ Gestion d\'état et persistance des données');
    });
});
