'use strict';

const Router = require('koa-router');
const router = Router();
const userSessionController = require('../controllers/user-session');

router.get('/', userSessionController.getActiveUserSession);
router.get('/started/:session_id', userSessionController.getStartingTime);
router.get('/feedback/:user_session_id', userSessionController.getFeedback);
router.get('/:user_session_id', userSessionController.getUserSessionDetails);
router.post('/', userSessionController.createOrGetUserSession);

module.exports = router;