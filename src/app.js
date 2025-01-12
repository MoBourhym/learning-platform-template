const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/env');
const db = require('./config/db');

const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
let server;

// Middleware de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Une erreur interne est survenue',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Middleware de routes non trouvées
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée'
  });
};

// Configuration des middlewares
function setupMiddlewares() {
  // Sécurité
  app.use(helmet());
  app.use(cors());

  // Parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date(),
      uptime: process.uptime()
    });
  });
}

// Configuration des routes
function setupRoutes() {
  // Routes API
  app.use('/api/courses', courseRoutes);
  app.use('/api/students', studentRoutes);

  // Gestion des 404 et des erreurs
  app.use(notFoundHandler);
  app.use(errorHandler);
}

// Démarrage du serveur
async function startServer() {
  try {
    // Initialiser les connexions aux bases de données
    await db.connectMongo();
    await db.connectRedis();

    // Configuration de l'application
    setupMiddlewares();
    setupRoutes();

    // Démarrer le serveur HTTP
    server = app.listen(config.port, () => {
      console.log(`🚀 Serveur démarré sur le port ${config.port}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    });

    // Gestion des erreurs serveur
    server.on('error', (error) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      switch (error.code) {
        case 'EACCES':
          console.error(`Le port ${config.port} nécessite des privilèges élevés`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`Le port ${config.port} est déjà utilisé`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Gestion gracieuse de l'arrêt
async function shutdownGracefully(signal) {
  console.log(`Signal ${signal} reçu. Début de l'arrêt gracieux...`);

  if (server) {
    server.close(async (err) => {
      if (err) {
        console.error('Erreur lors de la fermeture du serveur HTTP:', err);
        process.exit(1);
      }

      try {
        // Fermeture des connexions aux bases de données
        await db.closeConnections();
        console.log('Toutes les connexions ont été fermées proprement');
        process.exit(0);
      } catch (error) {
        console.error('Erreur lors de la fermeture des connexions:', error);
        process.exit(1);
      }
    });

    // Arrêt forcé après un délai
    setTimeout(() => {
      console.error('Arrêt forcé après délai dépassé');
      process.exit(1);
    }, 10000).unref();
  }
}

// Gestion des signaux d'arrêt
process.on('SIGTERM', () => shutdownGracefully('SIGTERM'));
process.on('SIGINT', () => shutdownGracefully('SIGINT'));

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error('Erreur non capturée:', error);
  shutdownGracefully('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesse rejetée non gérée:', reason);
  shutdownGracefully('unhandledRejection');
});

// Démarrage de l'application
startServer();

module.exports = app;