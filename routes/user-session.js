'use strict';

let Router = require('koa-router');
let router = Router();
const userSessionController = require('../controllers/user-session');

router.post('/', userSessionController.createUserSession);

module.exports = router;