'use strict';

const Router = require('koa-router');
const router = Router();
const categoryController = require('../controllers/category');

router.get('/', categoryController.getCategories);

module.exports = router;