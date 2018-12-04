'use strict';

const Router = require('koa-router');
const router = Router();
const sessionController = require('../controllers/session');
const middleware = require('../controllers/middleware');

router.get('/:session_token', sessionController.getPublicSessionByToken);

router.use(middleware.professorCheck);

router.get('/', sessionController.getSessions);
router.get('/:session_id', sessionController.getSession);
router.post('/', sessionController.createSession);

router.put('/', sessionController.updateSession);
router.put('/close', sessionController.forceClose);

//i think that delete should not exist

module.exports = router;