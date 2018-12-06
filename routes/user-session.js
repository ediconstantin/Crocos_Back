'use strict';

const Router = require('koa-router');
const router = Router();
const userSessionController = require('../controllers/user-session');

router.get('/', userSessionController.getActiveUserSession);
router.get('/started/:session_id', userSessionController.getStartingTime);
router.post('/', userSessionController.createOrGetUserSession);

module.exports = router;