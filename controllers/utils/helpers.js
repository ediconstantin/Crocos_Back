'use strict';

const axios = require('axios');
const Group = require('../../models').Group;
const Score = require('../../models').Score;
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

module.exports.generateSimpleToken = (characters) => {
    let stringArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c',
        'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
        'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '&', '@'];

    let token = "";

    for (let i = 0; i < characters; i++) {
        let randomNumber = Math.ceil(Math.random() * stringArray.length) - 1;
        token += stringArray[randomNumber];
    }

    return token;
}

module.exports.simpleDateToUnixTime = (simpleDate) => {
    //simpleDate should have the format '12 02 2015 21:15:00'
    let unixTime = parseInt((new Date(simpleDate).getTime() / 1000).toFixed(0))
    return unixTime;
}

module.exports.checkIfSessionIsPublic = (startDate, endDate) => {
    let now = parseInt(Date.now() / 1000).toFixed(0);

    if (now >= startDate && now < endDate) {
        return 1;
    } else if (endDate < startDate) {
        throw new AppError('End date is lower than start date', 400);
    }

    return 0;
}

module.exports.shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

module.exports.calculateScore = async (userSession) => {

    let answers = await userSession.getAnswers();

    let score = 0;

    await answers.map(async answer => {

        let question = await Question.findOne({
            where:{
                id: answers.question_id
            }
        });

        if(question[answer.answer] === question[question.correct]){
            score++;
        }
    });

    await Score.create({
            score: score,
            user_session_id : userSession.id
    });

}