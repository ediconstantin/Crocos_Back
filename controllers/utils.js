'use strict';
const axios = require('axios');
const Group = require('../models').Group;
const Series = require('../models').Series;

module.exports.jwtSecret = 'wegijwoge341wekfwkepf12312r@@iejrfbvbefgerg4-weiroj.//3423jgr123@@@krebmerbr';

module.exports.validateEmail = async (token) => {

    let userData = {};
    let googleResponse = await axios.get("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token);

    userData.firstname = googleResponse.data.given_name;
    userData.lastname = googleResponse.data.family_name;
    userData.email = googleResponse.data.email;

    if (googleResponse.data.email.includes('@stud.ase.ro')) {
        userData.is_prof = 0;
        return userData;
    } else if (googleResponse.data.email.includes('@csie.ase.ro')) {
        userData.is_prof = 1;
        return userData;
    }

    //doesn't work this way. correct it.
    throw new Error({ info: 'Email is not valid', code: 403 });
}

module.exports.validateGroup = async (studentData, group) => {

    let foundGroup = await Group.findOne({
        where: {
            name: group
        },
        raw: true
    });

    if (foundGroup) {
        studentData.groupId = foundGroup.id;
        return studentData;
    }

    throw new Error({ info: 'Group or Series is not valid!', code: 400 });
}
