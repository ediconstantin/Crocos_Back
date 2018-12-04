'use strict';

const Session = require('../models').Session;
const Test = require('../models').Test;
const AppError = require('./utils/AppError').AppError;
const generateSimpleToken = require('./utils/helpers').generateSimpleToken;
const simpleDateToUnixTime = require('./utils/helpers').simpleDateToUnixTime;
const checkIfSessionIsPublic = require('./utils/helpers').checkIfSessionIsPublic;

const sessionStatusTypes = [1, 2, 3];

module.exports.getSessions = async (ctx) => {

    if (ctx.query.status) {

        if (sessionStatusTypes.includes(ctx.query.status)) {

            let sessions = await Session.findAll({
                where: {
                    user_id: ctx.state.jwtdata.id,
                    isPublic: ctx.query.status
                },
                attributes: ['start_hour', 'end_hour', 'isPublic'],
                order: [
                    ['start_hour', 'DESC']
                ]
            });

            ctx.body = sessions;

        } else {
            throw new AppError('Not a valid option', 400);
        }
    } else {

        let newSessions = Session.findAll({
            where: {
                user_id: ctx.state.jwtdata.id,
                isPublic: 0
            },
            attributes: ['start_hour', 'end_hour', 'isPublic'],
            order: [
                ['start_hour', 'DESC']
            ]
        });

        let openSessions = Session.findAll({
            where: {
                user_id: ctx.state.jwtdata.id,
                isPublic: 1
            },
            attributes: ['start_hour', 'end_hour', 'isPublic'],
            order: [
                ['start_hour', 'DESC']
            ]
        });

        let closedSessions = Session.findAll({
            where: {
                user_id: ctx.state.jwtdata.id,
                isPublic: 2
            },
            attributes: ['start_hour', 'end_hour', 'isPublic'],
            order: [
                ['start_hour', 'DESC']
            ]
        });

        //or get all and put them in different lists by hand based on isPublic attribute
        Promise.all([newSessions, openSessions, closedSessions])
            .then((responses) => {
                ctx.body = [...responses[0], ...responses[1], ...responses[2]];
            })
    }
}

module.exports.getSession = async (ctx) => {

    let session = await Session.findOne({
        where: {
            id: ctx.params.session_id,
            user_id: ctx.state.jwtdata.id
        }
    });

    ctx.body = session;
}

module.exports.getPublicSessionByToken = async (ctx) => {

    let session = await Session.findOne({
        where: {
            token: req.params.token,
            isPublic: true
        },
        include: [{ model: Test, attributes: ['id', 'name', 'duration', 'questionsNumber', 'retries', 'backwards'] }]
    });

    ctx.body = session;
}

module.exports.createSession = async (ctx) => {

    let session = ctx.request.body;

    session.user_id = ctx.state.jwtdata.id;
    session.token = generateSimpleToken(6);
    session.start_hour = simpleDateToUnixTime(ctx.request.body.start_hour);
    session.end_hour = simpleDateToUnixTime(ctx.request.body.end_hour);
    session.isPublic = checkIfSessionIsPublic(session.start_hour, session.end_hour);

    await Session.create(session);

    ctx.status = 201;
    ctx.body = { message: 'The session was created' };
}

module.exports.updateSession = async (ctx) => {

    let session = await Session.findOne({
        where: {
            id: ctx.request.body.session_id,
            user_id: ctx.state.jwtdate.id
        }
    });

    if (session.isPublic === 0) {
        ctx.request.body.isPublic = checkIfSessionIsPublic(ctx.request.body.start_hour, ctx.request.body.end_hour);
        session = await session.update(ctx.request.body);
        ctx.body = session;
    } else if (session.isPublic === 1) {
        ctx.request.body.isPublic = checkIfSessionIsPublic(session.start_hour, ctx.request.body.end_hour);
        session = await session.update({ end_hour: ctx.request.body.end_hour });
        ctx.body = session;
    } else {
        throw new AppError('Closed sessions cannot be modified.', 400);
    }
}

module.exports.forceClose = async (ctx) => {

    let end_hour = parseInt((new Date.now() / 1000).toFixed(0));
    await Session.update({
        isPublic: 0,
        end_hour: end_hour,
    },
        {
            where: {
                id: ctx.params.session_id,
                user_id: ctx.state.jwtdate.id
            }
        });

    ctx.body = { message: 'The session was forced closed' };
}