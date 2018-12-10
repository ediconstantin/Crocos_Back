const Answer = require('../models').Answer;
const Question = require('../models').Question;
const validateUserSession = require('./services/user-session').validateUserSession;
const AppError = require('./utils/AppError').AppError;
const validateAnswer = require('./services/answer').validateAnswer;
const getFeedback = require('./services/answer').getFeedback;

//with parameter for force-closing the user-session or different endpoint??
module.exports.updateAnswer = async (ctx, next) => {

    let answer = await Answer.findOne({
        where: {
            id: ctx.request.body.answer_id,
            answer: '#',
        },
        include: { model: Question }
    });

    if (!answer) {
        throw new AppError('Answer unavailable', 400);
    }

    let liveFeedback = await validateUserSession(answer.user_session_id, ctx.state.jwtdata.id);
    validateAnswer(answer.started, answer.question.duration);

    await answer.update({ answer: ctx.request.body.answer });

    ctx.body = getFeedback(liveFeedback, answer.question);
}

module.exports.startTiming = async (ctx) => {

    let answer = await Answer.findOne({
        where: {
            id: ctx.request.body.answer_id,
            answer: '#',
            started: 0
        },
    });

    validateUserSession(answer.user_session_id, ctx.state.jwtdata.id);

    let started = parseInt(Date.now() / 1000).toFixed(0);
    await answer.update({ started: started });

    ctx.body = { message: "Answer updated!" };
}
