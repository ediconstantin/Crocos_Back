'use strict';

const axios = require('axios');
const Group = require('../../models').Group;
const User = require('../../models').User;
const AppError = require('./AppError').AppError;

let uniqueEmail = async (email) => {

    let unique = await User.findOne({
        where: {
            email: email
        },
        raw: true
    });

    if (unique) {

        return false;
    }

    return true;
}

module.exports.validateEmail = async (token) => {

    let userData = {};
    let googleResponse = await axios.get("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token);

    userData.firstname = googleResponse.data.given_name;
    userData.lastname = googleResponse.data.family_name;
    userData.email = googleResponse.data.email;

    if (await uniqueEmail(googleResponse.data.email)) {
        if (googleResponse.data.email.includes('@stud.ase.ro')) {
            userData.is_prof = 0;
            return userData;
        } else if (googleResponse.data.email.includes('@csie.ase.ro')) {
            userData.is_prof = 1;
            return userData;
        } else {
            throw new AppError('Email is not valid', 403);
        }
    } else {
        throw new AppError('You are already registered', 400);
    }
}

module.exports.validateGroup = async (studentData, group) => {

    let foundGroup = await Group.findOne({
        where: {
            name: group
        },
        raw: true
    });

    if (foundGroup) {
        studentData.group_id = foundGroup.id;
        return studentData;
    }

    throw new AppError('Group is not valid', 400);
}