const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const app = new Koa

const routing = require('./routes')

app.use(bodyparser())
routing(app)

app.listen(8081, () => console.log('程序启动在 8081端口'))