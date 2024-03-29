'use strict';

const UserSession = require('../../models').UserSession;
const Answer = require('../../models').Answer;
const Question = require('../../models').Question;
const Session = require('../../models').Session;
const Test = require('../../models').Test;
const AppError = require('../utils/AppError').AppError;
const getTestQuestions = require('./test').getTestQuestions;
const getTestThroughSession = require('./session').getTestThroughSession;
const shuffleArray = require('../utils/helpers').shuffleArray;

let createErrorMessage = (retries) => {
    if (retries === 1) {
        return 'The test could only be taken 1 time.';
    }
    return 'The test could only be taken ' + retries + ' times.';
}

let validateNewUserSession = async (session_id, retries, user_id) => {
    let userSessions = await UserSession.count({
        where: {
            session_id: session_id,
            user_id: user_id
        }
    });

    if (userSessions >= retries) {
        throw new AppError(createErrorMessage(retries), 400);
    }
}

module.exports.getUserSessionData = async (activeUserSession) => {
    let questionsMeta = await Answer.findAll({
        where: {
            user_session_id: activeUserSession.id
        },
        attributes: ['id', 'answer', 'started'],
        include: {
            model: Question, attributes: ['id', 'question', 'ans1', 'ans2', 'ans3', 'ans4',
                'multiple', 'open', 'duration']
        }
    });

    return questionsMeta;
}

let withdrawQuestions = (questions, questionsNumber) => {
    return questions.slice(0, questionsNumber);
}

module.exports.createUserSession = async (session_id, user_id) => {
    let testMeta = await getTestThroughSession(session_id);

    //await validateNewUserSession(session_id, testMeta.retries, user_id);

    let userSession = await UserSession.create({
        started: 0,
        isOpen: true,
        session_id: session_id,
        user_id: user_id
    });

    return {userSession: userSession, test_id: testMeta.id};
}

module.exports.createsUserSessionQuestions = async (testId, userSessionId) => {
    let test = await getTestQuestions(testId);

    let questions = withdrawQuestions(shuffleArray(test.questions), test.questionsNumber);

    let answers = [];

    console.log("here");
    for (let i = 0; i < questions.length; i++) {
        answers[i] = Answer.create({
            question_id: questions[i].id,
            user_session_id: userSessionId,
        })
    }

    let questionsMeta = [];
    await Promise.all(answers).then(values => {
        questionsMeta = values.map((value, index) => {
            return { ...{ id: value.id, answer: value.answer, started: value.started }, question: questions[index] }
        });

    });

    return questionsMeta;
}

module.exports.validateUserSession = async (userSessionId, userId) => {

    let userSession = await UserSession.findOne({
        where: {
            id: userSessionId,
            user_id: userId,
            isOpen: 1
        },
        include: { model: Session, attributes: ['strict_timed'], include: { model: Test, attributes: ['duration', 'feedback'] } }
    });

    //if the cron job will handle the closing of a user session the second validation is not needed anymore
    if (!userSession || (userSession.session.strict_timed && userSession.started + userSession.session.test.duration + 30 < parseInt((Date.now() / 1000).toFixed(0)))) {
        throw new AppError('The answer doesn\'t belong to an open user-session', 400);
    }

    return { liveFeedback: userSession.session.test.feedback, strictTimed: userSession.session.strict_timed };
}