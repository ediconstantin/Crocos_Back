'use strict';

const AppError = require('../utils/AppError').AppError;

module.exports.validateAnswer = (strictTimed, started, duration) => {
    if (!strictTimed && (started + duration + 15 < parseInt(Date.now() / 1000).toFixed(0))) {
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