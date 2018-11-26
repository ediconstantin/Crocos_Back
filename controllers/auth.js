'use strict';
const jwt = require('jsonwebtoken');
const User = require('../models').User;
const jwtSecret = require('./utils').jwtSecret;
const axios = require('axios');
const validateEmail = require('./utils').validateEmail;
const validateGroup= require('./utils').validateGroup;

module.exports.register = async (ctx) => {

    let userData = await validateEmail(ctx.request.body.token);

    if (!userData.isProf) {
        userData.groupId = await validateGroup(userData, ctx.request.body.group);
    }

    //generate photo and append its path to the userData.photo object
    //userData.photo = generatePhoto(ctx.request.body.email)

    await User.create(userData);

    ctx.status = 201;
    ctx.body = {
        message: 'Created'
    }
}

module.exports.login = async (ctx) => {

    let googleResponse = await axios.get("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + ctx.request.body.token);

    let user = await User.findOne({
        where: {
            email: googleResponse.data.email
        }
    });

    if (user) {
        ctx.status = 200;
        ctx.body = {
            token: jwt.sign({
                isProf: user.isProf, isAdmin: user.isAdmin, id: user.id,
                groupId: user.groupId, firstname: user.firstname
            },
                jwtSecret),
            message: 'Login successfull'
        }
    } else {
        ctx.status = 403;
        ctx.body = {
            message: 'Forbbidden'
        }
    }
};