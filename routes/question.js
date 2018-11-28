'use strict';

const Router = require('koa-router');
const router = Router();
const questionController = require('../controllers/question.js');
const middleware = require('../controllers/middleware.js');

router.use(middleware.professorCheck);

router.get('/', questionController.getQuestions);
router.get('/:id', questionController.getQuestion);
router.post('/', questionController.createQuestion);
router.put('/', questionController.updateQuestion);
router.delete('/:id', questionController.removeQuestion);

module.exports = router;