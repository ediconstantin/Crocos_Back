const UserSession = require('../models').UserSession;
const AppError = require('./utils/AppError').AppError;
const getTestQuestions = require('./services/test').getTestQuestions;
const getTestThroughSession = require('./services/session').getTestThroughSession;
const validateNewUserSession = require('./services/user-session').validateNewUserSession;

//the method createUserSession should be transformed into a service
//and an endpoint should be called createOrGetSession

//this method should be created so if a user quits then enters again 
//the last activ user session is returned
//else it creates a new session, random questions are selected, and default answers are inserted pointing to those questions

//user session should have a isOpen property which indicates if it's open or not

//user session should also have a timestamp set at start

//and for the questions to be remembered
//the answers table will be populated with a default answer for every question
//then questions will be retrieved with the user session, through the session method

//answers should also have timestamps to ensure that questions independent time
//is respected
//the timestamp is generated when the full question is displayed (with 5-10 seconds delay)
//when an answer is send is also generated a timestamp, server adds the duration of the question with the inital timestamp
//when question times are used: if the received timestamp is lower than the calculated timestamp
//when test time is used: if the received timestamp is lower than the user session timestamp + test duration
//then the answer is valid, saved and the feedback is given

//at the end of the test, a request will be made to close the user session
//when the session closes via cron job, all associated user sessions are also closed
//and the score is calculated taking in consideration the questions that are not "open"

//problem: if a user exists when a timed question is on, how does he retrieve from the server the remaining time?
module.exports.createUserSession = async (ctx) => {

    let testMeta = await getTestThroughSession(ctx.request.body.session_id);
    let test = await getTestQuestions(testMeta.id, testMeta.questionsNumber);

    await validateNewUserSession(testId, test.retries, ctx.state.jwtdata.id);

    let userSession = await UserSession.create({
        session_id: ctx.request.body.session_id,
        test_id: testMeta.id,
        user_id: ctx.state.jwtdata.id
    });

    ctx.status = 201;
    ctx.body = { questions: test.questions, userSession: { id: userSession.id } };
}

module.exports.createOrGetUserSession = async (ctx) => {


}