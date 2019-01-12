'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models').User;
const jwtSecret = require('./utils/constants').jwtSecret;
const axios = require('axios');
const AppError = require('./utils/AppError').AppError;
const validateEmail = require('./utils/helpers').validateEmail;
const validateGroup = require('./utils/helpers').validateGroup;

module.exports.register = async (ctx) => {

    let userData = await validateEmail(ctx.request.body.token);

    if (!userData.isProf) {
        userData.groupId = await validateGroup(userData, ctx.request.body.group);
    }

    //generate photo using identicon
    //it will be served as a static on url/photo/emailWithout(@stud.ase.ro).jpg

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

    let group = await user.getGroup();
    let series = await group.getSeries();

    if (user) {
        ctx.status = 200;
        ctx.body = {
            token: jwt.sign({
                isProf: user.isProf, isAdmin: user.isAdmin, id: user.id,
                groupId: user.groupId, firstname: user.firstname, lastname: user.lastname
            },
                jwtSecret),
            firstname: user.firstname,
            lastname: user.lastname,
            group: group.name,
            series: series.name,
            isAdmin: user.isAdmin,
            isProf: user.isProf,
            isActive: user.isActive
        }
    } else {
        throw new AppError('You are not registered', 403);
    }
};