'use strict';

const Router = require('koa-router');
const router = Router();
const questionController = require('../controllers/question.js');
const professorCheck = require('../controllers/middleware.js').professorCheck;

router.use(professorCheck);

router.get('/', questionController.getQuestions);
router.get('/:id', questionController.getQuestion);
router.post('/', questionController.createQuestion);
router.post('/test/:test_id', questionController.createAndAppendtoTest);
router.put('/', questionController.updateQuestion);
router.delete('/:id', questionController.removeQuestion);

module.exports = router;