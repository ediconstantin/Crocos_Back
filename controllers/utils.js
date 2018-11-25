'use strict';
const Group = require('../models').Group;
const Series = require('../models').Series;

module.exports.validateEmail = async (token) => {

    let userData = {};
    let googleResponse = await axios.get("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token);

    userData.firstname = googleResponse.data.given_name;
    userData.lastname = googleResponse.data.family_name;

    if (googleResponse.data.email.includes('@stud.ase.ro')) {
        userData.isProf = 0;
        return userData;
    } else if (googleResponse.data.email.includes('@csie.ase.ro')) {
        userData.isProf = 1;
        return userData;
    }

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
        return studentDeta;
    }

    throw new Error({ info: 'Group or Series is not valid!', code: 400 });
}
