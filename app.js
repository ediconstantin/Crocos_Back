'use strict';

const PORT = 3015;
const Koa = require('koa');
const Router = require('koa-router');
const combineRouters = require('koa-combine-routers');
const sequelize = require('./models');
const app = new Koa();
const router = new Router();

sequelize.database.sync();

router.get("/", async ctx => {
   ctx.body = "nairu back-end init";
})

router.get("/version", async ctx => {
    ctx.body = "version 0.0.0"
})

const combinedRouters = combineRouters(
	router
)

app.use(combinedRouters())

app.listen(PORT, () => {
   console.log('nairu back-end');
   console.log('server started at: http://localhost:' + PORT);
})
