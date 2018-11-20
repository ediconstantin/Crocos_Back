'use strict';

const Router = require('koa-router');
const router = Router();
const userController = require('../controllers/user.js');
const middleware = require('../controllers/middleware');

router.use(middleware.errorHandling);
router.use(middleware.authorize);

router.get("/", userController.getUser)
router.post("/", userController.createUser)

module.exports = router;