'use strict';

const Router = require('koa-router');
const router = Router();
const sessionController = require('../controllers/session');
const middleware = require('../controllers/middleware');

router.get('/public/:session_token', sessionController.getPublicSessionByToken);

//router.use(middleware.professorCheck);

router.get('/', sessionController.getSessions);
router.get('/:session_id', sessionController.getSession);
router.get('/full/:session_id', sessionController.getSessionWithUserSessions);

router.post('/', sessionController.createSession);

router.put('/', sessionController.updateSession);
router.put('/close/:session_id', sessionController.forceClose);

router.delete('/:session_id', sessionController.deleteSession);

module.exports = router;