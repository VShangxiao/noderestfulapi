const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const app = new Koa
const routing = require('./routes')

app.use(async (ctx, next) => {
  try {
    await next()
  } catch(err) {
    ctx.status = 500
    ctx.status = err.status || err.statusCode || 500
    ctx.body = {
      message: err.message
    }
  }
})
app.use(bodyparser())
routing(app)

app.listen(8081, () => console.log('程序启动在 8081端口'))