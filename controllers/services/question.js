'use strict';

const Question = require('../../models').Question;

let changeQuestionValues = (question, user_id) => {
    let plainQuestion = question.toJSON();
    delete plainQuestion.id;
    plainQuestion.user_id = user_id;

    return plainQuestion;
}

module.exports.cloneQuestion = async (question, user_id) => {
    let plainQuestion = changeQuestionValues(question, user_id);
    let clonedQuestion = await Question.create(plainQuestion);

    return clonedQuestion;
}