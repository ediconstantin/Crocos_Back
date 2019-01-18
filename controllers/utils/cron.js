const Session = require('../../models').Session;
const calculateScore = require("./helpers").calculateScore;

module.exports.sessionsManagement = async () => {

    let time = Math.floor(new Date() / 1000);

    let openSessions = await Session.findAll({
        where:{
            start_hour: {
                $between:[time, time + 30],
            },
            status: 0
        }
    });

    let closeSessions = await Session.findAll({
        where:{
            end_hour: {
                $between: [time, time + 30]
            }, 
            status: 1
        }
    });

    openSessions.map(session => {
        session.status = 1;
        session.save();
    })

    closeSessions.map(async session => {

        session.status = 2;
        session.save();

        let toCloseUserSessions = await session.getUserSessions();

        toCloseUserSessions.map(async userSession => {
            userSession.isOpen = false;
            await calculateScore(userSession);
            userSession.save();
        })
    })
};