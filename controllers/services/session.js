const Test = require('../../models').Test;
const Session = require('../../models').Session;
const UserSession = require('../../models').UserSession;
const AppError = require('../utils/AppError').AppError;

module.exports.getTestThroughSession = async (session_id) => {

    let session = await Session.findOne({
        where: {
            id: session_id
        },
        attributes: [],
        include: {model: Test, attributes: ['id', 'questionsNumber']}
    });

    return session.test.id;

}