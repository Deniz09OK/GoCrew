const express = require('express');
const router = express.Router();
const controller = require('../controllers/MessagesController');

router.get('/', controller.getAllMessages);
router.get('/crew/:crew_id', controller.getMessagesByCrew);
router.post('/', controller.sendMessage);

module.exports = router;
