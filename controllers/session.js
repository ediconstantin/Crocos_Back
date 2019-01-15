'use strict';

const Session = require('../models').Session;
const Test = require('../models').Test;
const UserSession = require('../models').UserSession;
const AppError = require('./utils/AppError').AppError;
const generateSimpleToken = require('./utils/helpers').generateSimpleToken;
const simpleDateToUnixTime = require('./utils/helpers').simpleDateToUnixTime;
const checkIfSessionIsPublic = require('./utils/helpers').checkIfSessionIsPublic;
const sessionStatusTypes = require('./utils/constants').sessionStatusTypes;
const User = require('../models').User;
const Group = require('../models').Group;

module.exports.getSessions = async (ctx) => {

    if (ctx.query.status) {

        if (sessionStatusTypes.includes(ctx.query.status)) {

            let sessions = await Session.findAll({
                where: {
                    user_id: ctx.state.jwtdata.id,
                    status: ctx.query.status
                },
                attributes: ['start_hour', 'end_hour', 'status'],
                order: [
                    ['start_hour', 'DESC']
                ]
            });

            ctx.body = sessions;

        } else {
            throw new AppError('Not a valid option', 400);
        }
    } else if (ctx.query.sorted) {
        let sessions = {};
        sessions.new = Session.findAll({
            where: {
                user_id: ctx.state.jwtdata.id,
                status: 0
            },
            attributes: ['start_hour', 'end_hour', 'status'],
            order: [
                ['start_hour', 'DESC']
            ],
            include: [{ model: Test, attributes: ['name'] }]
        });

        sessions.open = Session.findAll({
            where: {
                user_id: ctx.state.jwtdata.id,
                status: 1
            },
            attributes: ['start_hour', 'end_hour', 'status'],
            order: [
                ['start_hour', 'DESC']
            ],
            include: [{ model: Test, attributes: ['name'] }]
        });

        sessions.closed = Session.findAll({
            where: {
                user_id: ctx.state.jwtdata.id,
                status: 2
            },
            attributes: ['start_hour', 'end_hour', 'status'],
            order: [
                ['start_hour', 'DESC']
            ],
            include: [{ model: Test, attributes: ['name'] }]
        });

        //or get all and put them in different lists by hand based on status attribute
        await Promise.all([sessions.new, sessions.open, sessions.closed])
            .then((responses) => {

                sessions.new = [...responses[0]];
                sessions.open = [...responses[1]];
                sessions.closed = [...responses[2]];

                //if spread operator is used directly promises status will be sent as well
                ctx.body = { ...sessions };
            })
    } else {
        let sessions = await Session.findAll({
            where: {
                user_id: ctx.state.jwtdata.id,
            },
            attributes: ['id', 'start_hour', 'end_hour', 'status'],
            order: [
                ['start_hour', 'DESC']
            ],
            include: [{ model: Test, attributes: ['name'] }]
        });

        ctx.body = sessions;
    }
}

module.exports.getSession = async (ctx) => {

    let session = await Session.findOne({
        where: {
            id: ctx.params.session_id,
            user_id: ctx.state.jwtdata.id
        },
        attributes: { exclude: ['test_id'] },
        include: [{ model: Test }]
    });

    ctx.body = session;
}

module.exports.getSessionWithUserSessions = async (ctx) => {

    let session = await Session.findOne({
        where: {
            id: ctx.params.session_id,
            user_id: ctx.state.jwtdata.id
        },
        attributes: ['id'],
        include: [
            { model: UserSession, attributes:['id'], include: [
                {
                    model:User, attributes:['firstname', 'lastname'], include:[
                    {
                        model:Group, attributes: ['name']}
                ]}
            ]}
        ]
    });

    ctx.body = session;
}

module.exports.getPublicSessionByToken = async (ctx) => {

    let session = await Session.findOne({
        where: {
            token: ctx.params.session_token,
            status: 1
        },
        attributes: { exclude: ['test_id'] },
        include: [{ model: Test, attributes: ['id', 'name', 'duration', 'questionsNumber', 'retries', 'backwards'] }]
    });

    if (session) {
        ctx.body = session;
    } else {
        throw new AppError('Session was not found', 404);
    }

}

module.exports.createSession = async (ctx) => {

    let session = ctx.request.body;

    session.user_id = ctx.state.jwtdata.id;
    session.token = generateSimpleToken(6);
    session.start_hour = simpleDateToUnixTime(ctx.request.body.start_hour);
    session.end_hour = simpleDateToUnixTime(ctx.request.body.end_hour);
    session.status = checkIfSessionIsPublic(session.start_hour, session.end_hour);

    await Session.create(session);

    ctx.status = 201;
    ctx.body = { message: 'The session was created' };
}

module.exports.updateSession = async (ctx) => {

    let session = await Session.findOne({
        where: {
            id: ctx.request.body.session_id,
            user_id: ctx.state.jwtdata.id
        }
    });

    let sessionData = ctx.request.body;

    if (session.status === 0) {
        sessionData.start_hour = sessionData.start_hour ? simpleDateToUnixTime(sessionData.start_hour) : session.start_hour;
        sessionData.end_hour = sessionData.end_hour ? simpleDateToUnixTime(sessionData.end_hour) : session.end_hour;
        sessionData.status = checkIfSessionIsPublic(sessionData.start_hour, sessionData.end_hour);
        session = await session.update(sessionData);
        ctx.body = session;
    } else if (session.status === 1) {
        sessionData.end_hour = sessionData.end_hour ? simpleDateToUnixTime(sessionData.end_hour) : session.end_hour;
        sessionData.status = checkIfSessionIsPublic(session.start_hour, sessionData.end_hour);
        session = await session.update({ end_hour: sessionData.end_hour, status: sessionData.status });
        ctx.body = session;
    } else {
        throw new AppError('Closed sessions cannot be modified.', 400);
    }
}

module.exports.forceClose = async (ctx) => {

    let end_hour = parseInt((Date.now() / 1000).toFixed(0));
    await Session.update({
        status: 2,
        end_hour: end_hour,
    },
        {
            where: {
                id: ctx.params.session_id,
                user_id: ctx.state.jwtdata.id
            }
        });

    ctx.body = { message: 'The session was forced closed' };
}