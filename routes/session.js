const Router = require('koa-router');
const router = Router();
const sessionController = require('../controllers/session');

router.get('/', sessionController.getSessions);
router.get('/:session_id', sessionController.getSession);
router.get('/:session_token', sessionController.getPublicSessionByToken);

module.exports = router;