'use strict';

const Router = require('koa-router');
const router = Router();
const testController = require('../controllers/test');
const professorCheck = require('../controllers/middleware.js').professorCheck;

//router.use(professorCheck);

router.get('/', testController.getTests);
router.get('/:test_id', testController.getTest);
router.get('/public/user/:user_id', testController.getPublicTests);
router.get('/public/:test_id', testController.getPublicTest);

router.post('/', testController.createTest);
router.post('/question/:test_id', testController.addQuestionToTest);
router.post('/clone', testController.cloneTest);

router.put('/', testController.updateTest);

router.delete('/:test_id', testController.removeTest);
router.delete('/question/:test_id/:question_id', testController.removeQuestionFromTest);

module.exports = router;