const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./UsersRoutes'));
router.use('/crews', require('./CrewRoutes'));
router.use('/crew-members', require('./CrewMenbersRoutes'));
router.use('/tasks', require('./TasksRoutes'));
router.use('/messages', require('./MessagesRoutes'));
router.use('/announcements', require('./AnnoucementsRoutes'));
router.use('/announcements', require('./AnnouncementParticipantsRoutes'));
router.use('/documents', require('./DocumentsRoutes'));

module.exports = router;
