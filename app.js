'use strict';

const PORT = 3015;
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-body-parser');
const combineRouters = require('koa-combine-routers');
const sequelize = require('./models');
const jwt = require('koa-jwt');
const fs = require('fs');
const logger = require('koa-logger');
const morgan = require('koa-morgan');

const userRouter = require('./routes/user.js');
const middleware = require('./controllers/middleware');
const auth = require('./controllers/auth');
const jwtSecret = require('./controllers/utils/constants').jwtSecret;
const accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' });

const app = new Koa();
const router = new Router();

//this will be removed probably
sequelize.database.sync();

app.use(bodyParser());
app.use(morgan({ format: 'combined', stream: accessLogStream }));
app.use(logger());

app.use(middleware.errorHandling);

router.get("/", async (ctx, next) => {
    ctx.body = { message: "nairu back-end init" };
});

router.post('/login', auth.login);
router.post('/register', auth.register);

app.use(router.routes());
app.use(router.allowedMethods());

app.use(jwt({ secret: jwtSecret, key: 'jwtdata' }));

userRouter.prefix('/user');
const combinedRouters = combineRouters(
    userRouter
)

app.use(combinedRouters())

app.listen(PORT, () => {
    console.log('nairu back-end');
    console.log('server started at: http://localhost:' + PORT);
})
