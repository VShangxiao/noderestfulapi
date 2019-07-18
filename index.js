const Koa = require('koa')
const Router = require('koa-router')
const bodyparser = require('koa-bodyparser')

const app = new Koa
const router = new Router()
const usersRouter = new Router({
  prefix: '/users'
})

const db = [{ name:"李雷" }]


router.get('/', (ctx) => {
  ctx.body = '这是主页'
})

usersRouter.get('/', (ctx) => {
  // ctx.set('Allow', 'GET, POST')
  // ctx.body = [{ name: '李雷' }, { name: '韩梅梅' }]
  ctx.body = db
})

usersRouter.post('/', (ctx) => {
  db.push(ctx.request.body)
  ctx.body = ctx.request.body
})

usersRouter.get('/:id', (ctx) => {
  ctx.body = db[ctx.params.id * 1]
})

usersRouter.put('/:id', (ctx) => {
  db[ctx.params.id * 1] = ctx.request.body
  ctx.body = ctx.request.body
})

usersRouter.delete('/:id', (ctx) => {
  db.splice(ctx.params.id * 1, 1)
  ctx.status = 204
})

app.use(bodyparser())
app.use(router.routes())
app.use(usersRouter.routes())
app.use(usersRouter.allowedMethods())

app.listen(8081)