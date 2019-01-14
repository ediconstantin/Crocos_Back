'use strict';

const Test = require('../models').Test;
const Question = require('../models').Question;
const Category = require('../models').Category;
const testService = require('./services/test');

module.exports.getTests = async (ctx) => {

    let tests = await Test.findAll({
        where: {
            user_id: ctx.state.jwtdata.id
        },
        attributes: { exclude: ['category_id', 'user_id'] },
        include: [{ model: Category, attributes: ['id', 'name'] }]
    });

    ctx.body = tests;
}

module.exports.getTest = async (ctx) => {

    let test = await Test.findOne({
        where: {
            user_id: ctx.state.jwtdata.id,
            id: ctx.params.test_id
        },
        attributes: { exclude: ['category_id', 'user_id'] },
        include: [
            { model: Category, attributes: ['id', 'name'] },
            { model: Question, through: { attributes: [] } }
        ]
    })

    ctx.body = test;
}

module.exports.getPublicTests = async (ctx) => {

    let tests = await Test.findAll({
        where: {
            user_id: ctx.params.user_id,
            isPublic: true
        },
        include: { model: Category, attributes: ['id', 'name'] }
    })

    ctx.body = tests;
}

module.exports.getPublicTest = async (ctx) => {

    let test = await Test.findOne({
        where: {
            id: ctx.params.test_id,
            isPublic: true
        },
        attributes: { exclude: ['category_id', 'user_id'] },
        include: [
            { model: Category, attributes: ['id', 'name'] },
            { model: Question, through: { attributes: [] } }
        ]
    })

    ctx.body = test;
}

module.exports.createTest = async (ctx) => {

    ctx.request.body.user_id = ctx.state.jwtdata.id;

    let test = await Test.create(ctx.request.body);

    ctx.status = 201;
    ctx.body = { testId: test.id };

}

module.exports.cloneTest = async (ctx) => {

    let test = await testService.cloneTestService(ctx.request.body.test_id, ctx.state.jwtdata.id);

    ctx.status = 201;
    ctx.body = test;
}

module.exports.updateTest = async (ctx) => {

    await Test.update(ctx.request.body, {
        where: {
            id: ctx.request.body.id,
            user_id: ctx.state.jwtdata.id
        }
    });

    ctx.body = { message: 'The test was updated' };
}

module.exports.removeTest = async (ctx) => {

    await Test.destroy({
        where: {
            id: ctx.params.test_id,
            user_id: ctx.state.jwtdata.id
        }
    })

    ctx.body = { message: 'The test was deleted' };
}

module.exports.removeQuestionFromTest = async (ctx) => {

    let test = await Test.findOne({
        where: {
            id: ctx.params.test_id,
            user_id: ctx.state.jwtdata.id
        }
    });

    let question = await Question.findOne({
        where: {
            id: ctx.params.question_id,
        }
    })

    await test.removeQuestion(question);

    ctx.status = 200;
    ctx.body = { message: 'Questions were deleted from test' };
}

module.exports.addQuestionToTest = async (ctx) => {
    
    let test = await Test.findOne({
        where: {
            id: ctx.params.test_id,
            user_id: ctx.state.jwtdata.id
        }
    });

    let question = await Question.findOne({
        where: {
            id: ctx.request.body.questionId
        }
    });

    await test.addQuestion(question);

    ctx.status = 200;
    ctx.body = { message: "OK" };
}