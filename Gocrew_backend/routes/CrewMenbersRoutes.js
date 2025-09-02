const express = require('express');
const router = express.Router();
const controller = require('../controllers/CrewMenbersController');

router.get('/', controller.getAllCrewMembers);
router.post('/', controller.addCrewMember);

module.exports = router;
