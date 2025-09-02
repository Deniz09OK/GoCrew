const express = require('express');
const router = express.Router();
const controller = require('../controllers/DocumentsController');

router.get('/', controller.getAllDocuments);
router.post('/', controller.uploadDocument);

// Routes pour les documents de tâches
router.get('/task/:taskId', controller.getTaskDocuments);
router.post('/task/:taskId/upload', controller.uploadTaskDocument);
router.delete('/task-document/:documentId', controller.deleteTaskDocument);
router.get('/task-document/:documentId/download', controller.downloadTaskDocument);

module.exports = router;
