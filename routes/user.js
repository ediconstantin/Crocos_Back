'use strict';

const Router = require('koa-router');
const router = Router();
const userController = require('../controllers/user.js');

router.get("/", userController.getUsers)

module.exports = router;