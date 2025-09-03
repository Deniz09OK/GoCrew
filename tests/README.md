# 🧪 Tests Playwright GoCrew

Ce dossier contient une suite complète de tests Playwright pour l'application GoCrew, couvrant tous les aspects du workflow utilisateur.

## 📋 Tests Implémentés

### 1. Tests d'Authentification (`auth.spec.js`)
- ✅ Inscription d'un nouvel utilisateur
- ✅ Connexion avec utilisateur existant  
- ✅ Échec de connexion avec mauvais identifiants
- ✅ Déconnexion utilisateur
- ✅ Navigation entre pages d'authentification

### 2. Tests des Annonces (`announcements.spec.js`)
- ✅ Créer une nouvelle annonce
- ✅ Modifier une annonce existante
- ✅ Gérer les tâches dans une annonce (créer, modifier, supprimer)
- ✅ Supprimer une annonce
- ✅ Filtrer et rechercher des annonces

### 3. Tests des Crews/Voyages (`crews.spec.js`)
- ✅ Créer un nouveau crew
- ✅ Inviter des membres dans un crew
- ✅ Gérer les tâches dans un crew (créer, modifier, déplacer, supprimer)
- ✅ Modifier les informations d'un crew
- ✅ Supprimer un crew
- ✅ Visualiser les statistiques du crew

### 4. Workflow Complet (`complete-workflow.spec.js`)
Test intégrant toutes les fonctionnalités dans un scénario utilisateur complet :

1. **Inscription** d'un nouvel utilisateur
2. **Connexion** avec les identifiants créés
3. **Navigation** vers le profil utilisateur
4. **Navigation** vers l'accueil
5. **Navigation** vers les annonces
6. **Création** d'une nouvelle annonce
7. **Création** d'une tâche dans l'annonce
8. **Modification** de la tâche
9. **Suppression** de la tâche
10. **Suppression** de l'annonce
11. **Navigation** vers la section voyages
12. **Création** d'un nouveau crew
13. **Création** d'une tâche dans le crew
14. **Modification** de la tâche du crew
15. **Suppression** de la tâche du crew
16. **Suppression** du crew
17. **Déconnexion** de l'utilisateur

## 🚀 Exécution des Tests

### Prérequis

1. **Services en cours d'exécution** :
   ```bash
   # Terminal 1 - Frontend
   cd Gocrew_frontend
   npm run dev
   
   # Terminal 2 - Backend  
   cd Gocrew_backend
   npm run start
   
   # Terminal 3 - Base de données (si nécessaire)
   docker-compose up
   ```

2. **Installation de Playwright** (si pas déjà fait) :
   ```bash
   npm install -D @playwright/test
   npx playwright install
   ```

### Méthodes d'Exécution

#### 🖥️ Windows (PowerShell)
```powershell
# Exécuter le script automatique
.\run-tests.ps1

# Ou manuellement
npx playwright test
```

#### 🐧 Linux/Mac (Bash)
```bash
# Exécuter le script automatique
chmod +x run-tests.sh
./run-tests.sh

# Ou manuellement
npx playwright test
```

#### ⚡ Commandes Individuelles
```bash
# Test d'authentification uniquement
npx playwright test auth.spec.js

# Tests des annonces uniquement  
npx playwright test announcements.spec.js

# Tests des crews uniquement
npx playwright test crews.spec.js

# Workflow complet uniquement
npx playwright test complete-workflow.spec.js

# Tous les tests avec interface graphique
npx playwright test --ui

# Mode debug (pas à pas)
npx playwright test --debug

# Tests avec navigateur visible
npx playwright test --headed
```

## 📊 Rapports et Résultats

### Rapport HTML
Après exécution, un rapport détaillé est généré dans :
- **Fichier** : `playwright-report/index.html`
- **Commande** : `npx playwright show-report`

### Vidéos d'Échec
En cas d'échec, des vidéos sont automatiquement enregistrées dans :
- **Dossier** : `test-results/`
- **Format** : `.webm` (lisible avec VLC ou navigateur)

### Captures d'Écran
Les captures d'écran d'échec sont sauvegardées avec les vidéos.

## ⚙️ Configuration

### Playwright Config (`playwright.config.js`)
- **Timeout** : 60 secondes par test
- **Retries** : 1 tentative en cas d'échec
- **Mode** : Navigateur visible pour debug
- **Viewport** : 1280x720
- **Serveurs** : Auto-démarrage frontend/backend

### Variables d'Environnement
```bash
# Mode headless pour CI/CD
CI=true npx playwright test

# Debug complet
DEBUG=pw:api npx playwright test
```

## 🛠️ Helpers et Utilitaires

### Fichier `helpers.js`
Contient des fonctions réutilisables :
- `generateTestData()` - Génère des données uniques
- `signup(page, testData)` - Fonction d'inscription
- `login(page, testData)` - Fonction de connexion
- `logout(page)` - Fonction de déconnexion
- `createAnnouncement(page, testData)` - Créer une annonce
- `createCrew(page, testData)` - Créer un crew
- `createTask()`, `editTask()`, `deleteTask()` - Gestion des tâches

### Fichier `setup.js`
Configuration globale des tests :
- Hooks `beforeAll`/`afterAll`
- Capture d'écran automatique en cas d'échec
- Gestion des erreurs console et page

## 🔧 Résolution de Problèmes

### Services Non Disponibles
```bash
# Vérifier les ports
netstat -an | grep 5173  # Frontend
netstat -an | grep 3000  # Backend

# Redémarrer les services
cd Gocrew_frontend && npm run dev
cd Gocrew_backend && npm run start
```

### Tests Instables
- Augmenter les timeouts dans `playwright.config.js`
- Utiliser `--slow-mo` pour ralentir l'exécution
- Vérifier les sélecteurs dans les helpers

### Échecs de Sélecteurs
- Les helpers utilisent plusieurs sélecteurs fallback
- Vérifier que les éléments UI ont les bons attributs
- Ajouter `data-testid` aux éléments critiques

## 📈 Métriques et Performances

- **Temps d'exécution moyen** : ~5-10 minutes pour tous les tests
- **Couverture fonctionnelle** : 90%+ des cas d'usage utilisateur
- **Stabilité** : Système de retry et sélecteurs multiples
- **Maintenance** : Helpers centralisés et configuration modulaire

## 🤝 Contribution

Pour ajouter de nouveaux tests :
1. Créer un nouveau fichier `.spec.js` dans `tests/e2e/`
2. Utiliser les helpers existants dans `helpers.js`
3. Suivre le pattern des tests existants
4. Ajouter le nettoyage dans `afterEach`
5. Mettre à jour cette documentation

## 📝 Notes Importantes

- Les tests utilisent des données générées dynamiquement pour éviter les conflits
- Chaque test nettoie ses données après exécution
- Les tests s'exécutent séquentiellement pour éviter les interférences
- Les vidéos et captures ne sont gardées qu'en cas d'échec
- Le mode headless est désactivé par défaut pour faciliter le debug
