'use strict';

const User = require('../models').User;

module.exports.getUser = async (ctx) => {
    let users = await User.findAll();
    ctx.body = users;
}

module.exports.createUser = async (ctx) => {
    await User.create(ctx.request.body);
    ctx.body = ctx.request.body;
}