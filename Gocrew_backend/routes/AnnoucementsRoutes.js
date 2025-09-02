const express = require('express');
const router = express.Router();
const controller = require('../controllers/AnnouncementsController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', controller.getAllAnnouncements);
router.post('/', authenticateToken, controller.createAnnouncement);

module.exports = router;
