'use strict';

const PORT = 3015;
const Koa = require('koa');
const Router = require('koa-router');
const combineRouters = require('koa-combine-routers');
const sequelize = require('./models');
const bodyParser = require('koa-body-parser');
const jwt = require('koa-jwt');
const jwtSecret = require('./controllers/utils').jwtSecret;
const app = new Koa();
const auth = require('./controllers/auth');
const router = new Router();
const userRouter = require('./routes/user.js');

app.use(bodyParser());
sequelize.database.sync();

router.get("/", async (ctx, next) => {
    ctx.body = "nairu back-end init";
});

router.post('/login', auth.login);
router.post('/register', auth.register);

app.use(jwt({secret: jwtSecret, key: 'jwtdata'}));

userRouter.prefix('/user');
const combinedRouters = combineRouters(
    router,
    userRouter
)

app.use(combinedRouters())

app.listen(PORT, () => {
    console.log('nairu back-end');
    console.log('server started at: http://localhost:' + PORT);
})
