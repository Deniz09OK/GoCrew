const express = require('express');
const router = express.Router();
const controller = require('../controllers/CrewController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', controller.getAllCrews);
router.get('/:id', controller.getCrewById);
router.post('/', authenticateToken, controller.createCrew);

module.exports = router;
