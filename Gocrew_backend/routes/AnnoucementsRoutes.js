const express = require('express');
const router = express.Router();
const controller = require('../controllers/AnnouncementsController');

router.get('/', controller.getAllAnnouncements);
router.post('/', controller.createAnnouncement);

module.exports = router;
