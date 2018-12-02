const Test = require('../../models').Test;
const questionService = require('./question');

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