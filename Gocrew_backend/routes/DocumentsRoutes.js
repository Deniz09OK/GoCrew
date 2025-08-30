const express = require('express');
const router = express.Router();
const controller = require('../controllers/DocumentsController');

router.get('/', controller.getAllDocuments);
router.post('/', controller.uploadDocument);

module.exports = router;
