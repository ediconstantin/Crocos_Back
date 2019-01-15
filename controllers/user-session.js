'use strict';

const UserSession = require('../models').UserSession;
const Test = require('../models').Test;
const Session = require('../models').Session;
const Answer = require('../models').Answer;
const Question = require('../models').Question;
const getUserSessionData = require('./services/user-session').getUserSessionData;
const createUserSession = require('./services/user-session').createUserSession;
const createUserSessionQuestions = require('./services/user-session').createsUserSessionQuestions;

//after you select a session, you press the start button which loads
//the start button creates or gets a user session
//and retrieves the user session with the questions and the default answers
//after the load is finished the test is directly started (or with a short countdown)
module.exports.createOrGetUserSession = async (ctx) => {
    let activeUserSession = await UserSession.findOne({
        where: {
            session_id: ctx.request.body.session_id,
            user_id: ctx.state.jwtdata.id,
            isOpen: true
        }
    });

    let questions;
    if (activeUserSession) {
        questions = await getUserSessionData(activeUserSession);
    } else {
        activeUserSession = await createUserSession(ctx.request.body.session_id, ctx.state.jwtdata.id);
        questions = await createUserSessionQuestions(activeUserSession.test_id, activeUserSession.id);
        await activeUserSession.update({ started: parseInt((Date.now() / 1000).toFixed(0)) });
    }

    ctx.body = { userSession: activeUserSession, questions: questions };
}

//this will be called in the main screen of the app
//if an active userSession is present, it will be placed 
//under the token search input
module.exports.getActiveUserSession = async (ctx) => {
    let activeUserSession = await UserSession.findOne({
        where: {
            user_id: ctx.state.jwtdata.id,
            isOpen: true
        },
        attributes: ['id'],
        include: { model: Session, attributes: ['id'], include: { model: Test, attributes: ['name', 'questionsNumber', 'duration'] } }
    })

    ctx.body = activeUserSession;
}

module.exports.getStartingTime = async (ctx) => {
    let startingTime = await UserSession.findOne({
        where: {
            user_id: ctx.state.jwtdata.id,
            id: ctx.params.session_id
        },
        attributes: ['started']
    });

    ctx.body = startingTime;
}

module.exports.getFeedback = async (ctx) => {

    let userSession = await UserSession.findOne({
        where: {
            id: ctx.params.user_session_id,
            user_id: ctx.state.jwtdata.id
        },
        attributes: ['isOpen'],
        include: [
            { model: Session, attributes: ['status'], include: { model: Test, attributes: ['feedback'] } },
            { model: Answer, attributes: ['answer'], as: 'answers', include: { model: Question, attributes: { exclude: ['duration', 'user_id'] } } }
        ]
    });

    switch (userSession.session.test.feedback) {
        case 0: ctx.body = { message: 'Feedback is not available for this test' }; break;
        case 1:
        case 2: {
            if (userSession.isOpen) {
                ctx.body = { message: 'Feedback will be available when the test ends' };
                break;
            } else {
                ctx.body = userSession.answers;
                break;
            }
        }
        case 3: {
            if (userSession.session.status) {
                ctx.body = { message: 'Feedback will be available when the test session ends' };
                break;
            } else {
                ctx.body = userSession.answers;
                break;
            }
        }
    }
}

module.exports.getUserSessionDetails = async (ctx) => {

    if(ctx.state.jwtdata.isProf){
        


    } else {



    }

}