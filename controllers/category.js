'use strict';

const Category = require('../models').Category;

module.exports.getCategories = async (ctx) => {

    let categories = await Category.findAll({});

    ctx.body = categories;
};