const Router = require('koa-router');
const router = Router();
const answerController = require('../controllers/answer');

router.put('/', answerController.updateAnswer);
router.put('/start', answerController.startTiming)

module.exports = router;