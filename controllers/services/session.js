'use strict';

const Test = require('../../models').Test;
const Session = require('../../models').Session;

module.exports.getTestThroughSession = async (session_id) => {
    let session = await Session.findOne({
        where: {
            id: session_id
        },
        attributes: [],
        include: { model: Test, attributes: ['id', 'questionsNumber', 'retries'] }
    });

    return session.test;
}