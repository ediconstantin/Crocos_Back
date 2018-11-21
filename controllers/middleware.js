'use strict';

module.exports.authorize = async (ctx, next) => {
    console.log('authorize layer');
    await next();
}

//TO DO
//isProf middleware
//a middleware to identify if a user is taking a test and let him access private static files

module.exports.errorHandling = async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        console.log(err.message);
        ctx.status = 500;
        ctx.body = "Error happened";
    }
}