const Answer = require('../../models').Answer;
const Question = require('../../models').Question;
const AppError = require('../utils/AppError').AppError;

module.exports.validateAnswer = (started, duration) => {
    if (duration && (started + duration + 15 < parseInt(Date.now() / 1000).toFixed(0))) {
        throw new AppError('The answer time has expired', 400);
    }
}

module.exports.getFeedback = (liveFeedback, question) => {
    if (liveFeedback === 1) {
        let feedback = { correct: question.correct, feedback: question.feedback };
        return { feedback: feedback };

    } else {
        return { message: 'Answer updated!' };
    }
}