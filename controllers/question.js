'use strict';

const Question = require('../models').Question;
const Category = require('../models').Category;
const Test = require('../models').Test;
const AppError = require('./utils/AppError').AppError;

module.exports.getQuestions = async (ctx) => {

    let questions = await Question.findAll({
        where: {
            user_id: ctx.state.jwtdata.id
        },
        attributes: ['id', 'question'],
        include: [{ model: Category, attributes: ['id', 'name'] }]
    });

    ctx.body = questions;
};

module.exports.getQuestion = async (ctx) => {

    let question = await Question.findOne({
        where: {
            id: ctx.params.id,
            user_id: ctx.state.jwtdata.id
        },
        attributes: { exclude: ['category_id', 'user_id'] },
        include: [{ model: Category, attributes: ['id', 'name'] }]
    })

    if (question) {
        ctx.body = question;
    } else {
        throw new AppError('Not found', 404);
    }
}

module.exports.createQuestion = async (ctx) => {

    ctx.request.body.user_id = ctx.state.jwtdata.id;
    await Question.create(ctx.request.body);

    ctx.status = 201;
    ctx.body = { message: 'Question created' }
}

module.exports.updateQuestion = async (ctx) => {

    await Question.update(ctx.request.body, {
        where: {
            id: ctx.request.body.question_id,
            user_id: ctx.state.jwtdata.id
        }
    });

    ctx.status = 201;
    ctx.body = { message: 'Question updated' };
}

module.exports.removeQuestion = async (ctx) => {

    let q = await Question.destroy({
        where: {
            id: ctx.params.id,
            user_id: ctx.state.jwtdata.id
        }
    })

    if (q) {
        ctx.status = 200;
        ctx.body = { message: 'Question deleted' };
    } else {
        throw new AppError('Not found', 404);
    }
}

module.exports.createAndAppendtoTest = async(ctx) => {

    let question = await Question.create({...ctx.request.body, user_id: ctx.state.jwtdata.id});

    let test = await Test.findOne({
        where: {
            id: ctx.params.test_id,
            user_id: ctx.state.jwtdata.id
        }
    });

    await question.addTest(test);

    ctx.status = 201;
    ctx.body = { questionId: question.id }
}