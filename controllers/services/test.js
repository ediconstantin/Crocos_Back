const Test = require('../../models').Test;
const Question = require('../../models').Question;
const questionService = require('./question');
const AppError = require('../utils/AppError').AppError;

let changeTestValues = (test, user_id) => {

    let plainTest = test.toJSON();
    delete plainTest.id;
    plainTest.user_id = user_id;
    plainTest.name = 'Cloned: ' + plainTest.name;

    return plainTest;
}

let createQuestionsArray = async (questions, user_id) => {
    let clonedQuestions = [];

    for (let i = 0; i < questions.length; i++) {
        clonedQuestions.push(await questionService.cloneQuestion(questions[i], user_id));
    }

    return clonedQuestions;
}

module.exports.cloneTestService = async (test_id, user_id) => {

    let test = await Test.findOne({
        where: {
            id: test_id,
            isPublic: true
        }
    });

    let questions = await test.getQuestions();

    let clonedQuestions = await createQuestionsArray(questions, user_id);

    let plainTest = changeTestValues(test, user_id);

    let clonedTest = await Test.create(plainTest);

    await clonedTest.setQuestions(clonedQuestions);

    return clonedTest;
}

module.exports.getTestQuestions = async (test_id) => {

    let test = await Test.findOne({
        where: {
            id: test_id,
        },
        attributes: ['questionsNumber'],
        include: {
            model: Question, through: {
                attributes: [],
            }, attributes: ['id', 'question', 'ans1', 'ans2', 'ans3', 'ans4',
                'multiple', 'open', 'duration'],
        },
    });

    if (test) {
        return test;
    } else {
        throw new AppError('Test is either closed or non-existent', 400);
    }
}