const express = require('express');
const router = express.Router();
const controller = require('../controllers/TasksController');

// Routes pour Kanban
router.get('/', controller.getAllTasks);
router.get('/crew/:crewId', controller.getTasksByCrewId);
router.post('/', controller.createTask);
router.put('/:id', controller.updateTask);
router.delete('/:id', controller.deleteTask);
router.post('/reorder', controller.reorderTasks);
router.post('/:id/like', controller.toggleLike);

module.exports = router;
