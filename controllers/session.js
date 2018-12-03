const Session = require('../models').Session;

module.exports.getSessions = async (ctx) => {

    if (ctx.query.status) {
        let openSessions = await Session.findAll({
            where: {
                user_id: ctx.state.jwtdata.id,
                isPublic: 1
            },
            attributes: ['date', 'start_hour', 'end_hour'],
            order: [
                ['date', 'DESC'],
                ['start_hour', 'DESC']
            ]
        });

        let closedSessions = await Session.findAll({
            where: {
                user_id: ctx.state.jwtdata.id,
                isPublic: 0
            },
            attributes: ['date', 'start_hour', 'end_hour'],
            order: [
                ['date', 'DESC'],
                ['start_hour', 'DESC']
            ]
        });

        ctx.body = [...openSessions, ...closedSessions];

    } else {
        let sessions = await Session.findAll({
            where: {
                user_id: ctx.state.jwtdata.id,
            },
            attributes: ['date', 'start_hour', 'end_hour'],
            order: [
                ['date', 'DESC'],
                ['start_hour', 'DESC']
            ]
        })

        ctx.body = sessions;
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
        }
    });

    ctx.body = session;
}

module.exports.createSession = async (ctx) => {

    //conclude datetime db format
    //validate the date
    //isPublic will be managed by a cron job? probably
    //generate token

    ctx.request.body.user_id = ctx.state.jwtdata.id;
    await Session.create(ctx.request.body);

    ctx.status = 201;
    ctx.body = { message: 'The session was created' };

}