'use strict';

const User = require('../models').User;

module.exports.getUsers = async (ctx) => {
    let users = await User.findAll();
    ctx.body = users;
}