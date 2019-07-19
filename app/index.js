const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const error = require('koa-json-error')
const app = new Koa
const routing = require('./routes')

app.use(error({
  postFormat: (e, {stack, ...rest})=>process.env.NODE_ENV === 'production' ? rest: { stack, ...rest }
}))
app.use(bodyparser())
routing(app)

app.listen(8081, () => console.log('程序启动在 8081端口'))