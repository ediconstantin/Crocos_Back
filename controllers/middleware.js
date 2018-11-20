module.exports.authorize = async (ctx, next) => {
    console.log('authorize layer');
    await next();
}

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