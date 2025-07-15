const express = require('express');
const router = express.Router();
const controller = require('../controllers/CrewController');

router.get('/', controller.getAllCrews);
router.get('/:id', controller.getCrewById);
router.post('/', controller.createCrew);

module.exports = router;
