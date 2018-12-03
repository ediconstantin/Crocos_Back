'use strict';

const AppError = require('./utils/AppError').AppError;

//a middleware to identify if a user is taking a test and let him access private static files
module.exports.professorCheck = async(ctx, next) => {

    if(ctx.state.jwtdata.isProf){
        await next();
    } else {
        ctx.status = 403;
        ctx.body = {message: 'You are not allowed to do this.'}
    }

}

module.exports.errorHandling = async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        if (err instanceof AppError) {
            ctx.status = err.code;
            ctx.body = {message: err.message};
            console.log(err);
        } else {
            ctx.status = 500;
            ctx.body = {message: 'Server Error'};
            console.log(err);
        }
    }
}