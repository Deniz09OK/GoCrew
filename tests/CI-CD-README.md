# Tests E2E avec Playwright - Pipeline CI/CD

## 🚀 Pipeline GitLab CI/CD

Le pipeline GitLab CI/CD inclut maintenant les tests E2E automatisés avec Playwright.

### Stages du Pipeline

1. **install_backend** - Installation des dépendances backend
2. **install_frontend** - Installation des dépendances frontend  
3. **install_tests** - Installation de Playwright et des navigateurs
4. **build_backend** - Build du backend
5. **build_frontend** - Build du frontend
6. **test_e2e** - Exécution des tests E2E Playwright
7. **docker_backend** - Build de l'image Docker backend
8. **docker_frontend** - Build de l'image Docker frontend
9. **docker-compose-up** - Test du déploiement Docker

### 🧪 Stage test_e2e

Le stage `test_e2e` :
- Utilise l'image Docker officielle Playwright `mcr.microsoft.com/playwright:v1.55.0-jammy`
- Lance une base de données PostgreSQL temporaire
- Démarre le backend et frontend en arrière-plan
- Exécute le test `complete-workflow-perfect.spec.js`
- Génère des rapports HTML et JUnit
- Sauvegarde les artifacts (screenshots, vidéos, rapports)

### 📊 Rapports de Tests

Les rapports de tests sont disponibles dans les artifacts GitLab CI :
- **playwright-report/** - Rapport HTML interactif
- **test-results/** - Screenshots et vidéos des échecs

### 🛠️ Configuration

- **Mode headless** : Automatiquement activé en environnement CI
- **Ralentissement** : Désactivé en CI pour optimiser la vitesse
- **Timeout** : 60 secondes par test
- **Retries** : 1 retry en cas d'échec

### 📝 Scripts NPM

```bash
npm run test          # Tous les tests Playwright
npm run test:perfect  # Test workflow complet (local)
npm run test:ci       # Test CI avec rapports JUnit et HTML
```

### 🔧 Variables d'Environnement CI

- `CI=true` - Détection automatique de l'environnement CI
- `DATABASE_URL` - Configuration PostgreSQL temporaire
- `POSTGRES_DB=gocrew` - Nom de la base de données
- `POSTGRES_USER=postgres` - Utilisateur PostgreSQL
- `POSTGRES_PASSWORD=admin` - Mot de passe PostgreSQL

### ⚡ Optimisations

- Tests exécutés en parallèle avec les builds Docker
- Échec des tests n'interrompt pas le pipeline (`allow_failure: true`)
- Artifacts conservés 30 jours
- Installation mise en cache entre les jobs
