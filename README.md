# Learning Platform API

Une API RESTful pour une plateforme d'apprentissage, permettant la gestion des cours et des étudiants avec mise en cache Redis.

## 📋 Table des matières
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement](#lancement)
- [Structure du projet](#structure-du-projet)
- [Tests](#tests)
- [Choix techniques](#choix-techniques)
- [FAQ & Bonnes pratiques](#faq--bonnes-pratiques)
- [Contributions](#contributions)

## 🚀 Prérequis
- Node.js (v14+)
- MongoDB (v4+)
- Redis (v6+)

## ⚙️ Installation

1. Cloner le repository
```bash
git clone https://github.com/votre-username/learning-platform-api.git
cd learning-platform-template
```

2. Installer les dépendances
```bash
npm install
```

3. Copier le fichier d'environnement
```bash
cp .env.example .env
```

## 📝 Configuration

1. Configurer les variables d'environnement dans `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=learning_platform
REDIS_URI=redis://localhost:6379
NODE_ENV=development
```

## 🏃‍♂️ Lancement

1. Démarrer en mode développement
```bash
npm start
```

2. Autres commandes disponibles
```bash
npm test          # Exécuter les tests
npm run lint      # Vérifier le code
```

## 📁 Structure du projet
```
├ src
├── config/              # Configuration de l'application
│   ├── db.js           # Configuration des bases de données
│   └── env.js          # Validation des variables d'environnement
├── controllers/         # Contrôleurs de l'application
├── routes/             # Définition des routes
├── services/           # Services métier
├── tests/              # Tests
└── app.js              # Point d'entrée de l'application
├ .env                   # Les variables d'environnement
```

## 🛠 Choix techniques

### Express.js
- Framework web robuste et éprouvé
- Excellente performance et flexibilité
- Large écosystème de middlewares

### MongoDB
- Stockage de données flexible
- Excellent support des requêtes complexes
- Scalabilité horizontale

### Redis
- Cache performant
- Stockage en mémoire rapide
- Support des structures de données complexes

### Middlewares
- `helmet` : Sécurité HTTP
- `cors` : Gestion des Cross-Origin
- `morgan` : Logging des requêtes
- `dotenv` : Gestion des variables d'environnement

## 💡 FAQ & Bonnes pratiques

### Sécurité et Variables d'environnement

**Q: Quelles informations sensibles ne jamais commiter ?**
- Mots de passe et secrets
- Clés d'API
- Tokens d'authentification
- URLs de production
- Certificats privés

**Q: Pourquoi utiliser des variables d'environnement ?**
- Sécurité des données sensibles
- Configuration flexible par environnement
- Conformité aux bonnes pratiques DevOps
- Facilité de déploiement

### Architecture

**Q: Pourquoi créer un module séparé pour les connexions DB ?**
- Centralisation de la gestion des connexions
- Réutilisation du code
- Meilleure gestion des erreurs
- Facilite les tests

**Q: Comment gérer la fermeture des connexions ?**
- Écoute des signaux système (SIGTERM, SIGINT)
- Fermeture gracieuse des connexions
- Timeout de sécurité
- Logging des erreurs

### Configuration

**Q: Importance de la validation des variables d'environnement ?**
- Détection précoce des erreurs
- Configuration cohérente
- Meilleure maintenabilité
- Documentation implicite

**Q: Gestion des variables manquantes ?**
- Arrêt de l'application
- Message d'erreur explicite
- Logging détaillé
- Documentation des requis

### Organisation du code

**Q: Différence entre contrôleur et route ?**
- Route : définition des endpoints
- Contrôleur : logique métier
- Séparation des responsabilités
- Meilleure testabilité

**Q: Pourquoi séparer la logique métier des routes ?**
- Code plus maintenable
- Réutilisation facilitée
- Tests unitaires simplifiés
- Meilleure lisibilité

### Cache Redis

**Q: Gestion efficace du cache ?**
- Stratégie de cache cohérente
- TTL appropriés
- Gestion des erreurs
- Invalidation intelligente

**Q: Bonnes pratiques pour les clés Redis ?**
- Nommage cohérent
- Préfixes par domaine
- Documentation des structures
- Gestion des collisions

## 🤝 Contributions

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour plus de détails.

## 📄 Licence

[MIT](LICENSE)