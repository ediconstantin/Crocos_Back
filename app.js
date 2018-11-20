'use strict';

const PORT = 3015;
const Koa = require('koa');
const Router = require('koa-router');
const combineRouters = require('koa-combine-routers');
const sequelize = require('./models');
const bodyParser = require('koa-body-parser');
const app = new Koa();
const router = new Router();
const userRouter = require('./routes/user.js');

sequelize.database.sync();

router.get("/", async (ctx, next) => {
    ctx.body = "nairu back-end init";
})

userRouter.prefix('/user');

const combinedRouters = combineRouters(
    router,
    userRouter
)

app.use(bodyParser());
app.use(combinedRouters())

app.listen(PORT, () => {
    console.log('nairu back-end');
    console.log('server started at: http://localhost:' + PORT);
})
