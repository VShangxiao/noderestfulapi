# 3-2 安装搭建第一个 Koa 程序

```
npm init

npm i koa --save
```

新建 index.js

```
const Koa = require('koa')
const app = new Koa

app.use((ctx) => {
  ctx.body = 'Hello Koa!'
})

app.listen(8081)
```

运行

```
node index.js
```

为了方便，安装 nodemon

```
npm i nodemon --save-dev
```

表示在开发阶段安装.

安装完毕在 package.json 的 scripts 里面加入

```
  "scripts": {
    "start": "nodemon index.js"
  },
```

# 3-3 Koa 中间件与洋葱模型

在 Chrome 的 Console 写代码

```
fetch('//api.github.com/users').then(res => res.json()).then(json => {
  console.log(json)
})
```

这样很麻烦，使用 async await 语法

```
(async () => {
  const res = await fetch('//api.github.com/users')
  const json = await res.json()
  console.log(json)
})
```

使用 next async 语法，执行下一个中间件

```
const Koa = require('koa')
const app = new Koa

app.use(async (ctx, next) => {
  await next()
  console.log('1')
  ctx.body = 'Hello Zhihu API'
})
app.use(async (ctx) => {
  console.log('2')
})

app.listen(8081)
```

在 Chrome 里面使用 fetch 再试一次

```
fetch('/').then(res => res.text()).then(console.log)
```

# 4-1 路由

路由存在的意义

- 处理不同的URL
- 处理不同的HTTP方法
- 解析URL上的参数

# 4-2 自己编写 Koa 路由中间件

## 4.2.1 处理不同的URL

```
const Koa = require('koa')
const app = new Koa

app.use(async (ctx) => {
  if (ctx.url === '/') {
    ctx.body = '这是主页'
  } else if (ctx.url === '/users') {
    ctx.body = '这是用户列表页'
  } else {
    ctx.status = 404
  }
})

app.listen(8081)
```

## 4.2.2 处理不同的HTTP方法

```
const Koa = require('koa')
const app = new Koa

app.use(async (ctx) => {
  if (ctx.url === '/') {
    ctx.body = '这是主页'
  } else if (ctx.url === '/users') {
    if (ctx.method === 'GET') {
      ctx.body = '这是用户列表页'
    } else if (ctx.method === 'POST') {
      ctx.body = '创建用户'
    } else {
      ctx.status = 405
    }
  } else if (ctx.url.match(/\/users\/\w+/)) {
    const userId = ctx.url.match(/\/users\/(\w+)/)[1]
    ctx.body = `这是用户 ${userId}`
  } else {
    ctx.status = 405
  }
})

app.listen(8081)
```

# 4-3 使用 Koa-router 实现路由

安装 koa-router

```
npm i koa-router --save
```

```
const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa
const router = new Router()
const usersRouter = new Router({
  prefix: '/users'
})

router.get('/', (ctx) => {
  ctx.body = '这是主页'
})

usersRouter.get('/', (ctx) => {
  ctx.body = '这是 router 实现的用户列表'
})

usersRouter.post('/', (ctx) => {
  ctx.body = '这是创建用户'
})

usersRouter.get('/:id', (ctx) => {
  ctx.body = `这是用户 ${ctx.params.id}`
})

app.use(router.routes())
app.use(usersRouter.routes())

app.listen(8081)
```

多中间件功能

```
const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa
const router = new Router()
const usersRouter = new Router({
  prefix: '/users'
})

const auth = async (ctx, next) => {
  if (ctx.url !== '/users') {
    ctx.throw(401)
  }
  await next()
}

router.get('/', (ctx) => {
  ctx.body = '这是主页'
})

usersRouter.get('/', auth, (ctx) => {
  ctx.body = '这是 router 实现的用户列表'
})

usersRouter.post('/', auth, (ctx) => {
  ctx.body = '这是创建用户'
})

usersRouter.get('/:id', auth, (ctx) => {
  ctx.body = `这是用户 ${ctx.params.id}`
})

app.use(router.routes())
app.use(usersRouter.routes())

app.listen(8081)
```

# 4-4 HTTP option 方法的作用

> 1. 检测服务器所支持的请求方法
> 2. CORS中的预检请求

## 4.4.2 allowedMethods 的作用

1. 响应 option 方法，告诉它所支持的请求方法
2. 相应地返回405（不允许）和501（没实现）

# 4-5 RESTful API - 增删改查应该返回什么响应

- 实现增删改查
- 返回正确的响应

```
const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa
const router = new Router()
const usersRouter = new Router({
  prefix: '/users'
})


router.get('/', (ctx) => {
  ctx.body = '这是主页'
})

usersRouter.get('/', (ctx) => {
  ctx.body = [{ name: '李雷' }, { name: '韩梅梅' }]
})

usersRouter.post('/', (ctx) => {
  ctx.body = { name: '李雷' }
})

usersRouter.get('/:id', (ctx) => {
  ctx.body = { name: '李雷' }
})

usersRouter.put('/:id', (ctx) => {
  ctx.body = { name: '李雷2' }
})

usersRouter.delete('/:id', (ctx) => {
  ctx.status = 204
})

app.use(router.routes())
app.use(usersRouter.routes())
app.use(usersRouter.allowedMethods())

app.listen(8081)
```

# 5-1 控制器简介

## 5.1.1为什么要用控制器？

- 获取HTTP请求参数
- 处理业务逻辑
- 发送HTTP响应

### 5.1.1-1 获取HTTP请求参数

- Query String，如

> ?q=keyword

- Router Params， 如

> /users/:id

- Body，如

> { name:  "李雷" }

- Header，如

> Accept、Cookie

### 5.1.1-2 发送HTTP请求

- 发送 Status，如 200 400 等

- Body，如

> { name:  "李雷" }

- 发送Header，如

> Allow、Content-Type

### 5.1.1-3 编写控制器的最佳实践

- 每个资源的控制器放在不同的文件里
- 金陵使用类+类方法的形式编写控制器

- 严谨的错误处理

# 5-2 获取HTTP请求参数

安装解析请求体的中间件

```
npm i koa-bodyparser --save
```

```
const Koa = require('koa')
const Router = require('koa-router')
const bodyparser = require('koa-bodyparser')

const app = new Koa
const router = new Router()
const usersRouter = new Router({
  prefix: '/users'
})


router.get('/', (ctx) => {
  ctx.body = '这是主页'
})

usersRouter.get('/', (ctx) => {
  ctx.body = [{ name: '李雷' }, { name: '韩梅梅' }]
})

usersRouter.post('/', (ctx) => {
  ctx.body = { name: '李雷' }
})

usersRouter.get('/:id', (ctx) => {
  ctx.body = { name: '李雷' }
})

usersRouter.put('/:id', (ctx) => {
  ctx.body = { name: '李雷2' }
})

usersRouter.delete('/:id', (ctx) => {
  ctx.status = 204
})

app.use(bodyparser())
app.use(router.routes())
app.use(usersRouter.routes())
app.use(usersRouter.allowedMethods())

app.listen(8081)
```

# 5-3 发送HTTP响应

操作步骤：

> - 发送 status
> - 发送body
> - 增删改查

```
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
```

# 5-4 更合理的目录结构

- 将路由单独放在一个目录
- 将控制器单独放在一个目录
- 使用 类+方法 的方式组织控制器

添加自动化脚本，批量注册。

```
const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const app = new Koa

const routing = require('/routes')

app.use(bodyparser())
routing(app)

app.listen(8081)
```

# 6-1 错误处理简介

# 6-2 Koa自带的错误处理

- 制造 404、412、500三种错误
- 了解Koa自带的错误处理做了什么

# 6-3 自己编写错误处理中间件

# 6-4 使用 Koa-json-error 进行错误处理

安装 koa-json-error

```
npm i koa-json-error --save
```

Windows营造生产环境：

```
npm i cross-env --save-dev
```

修改 package.json

```
"scripts": {
  "start": "cross-env NODE_ENV=production node app",
  "dev": "nodemon app
},
```

修改配置使其在生产环境下禁用错误堆栈的返回

# 6-5 使用koa-parameter校验参数

安装 koa-parameter

```
npm i koa-parameter --save
```

app\controllers\users.js

```
const db = [{
  name: "李雷"
}]

class UsersCtl {
  find(ctx) {
    ctx.body = db
  }
  
  findById(ctx) {
    if (ctx.params.id * 1 >= db.length) {
      ctx.throw(412)
    }
    ctx.body = db[ctx.params.id * 1]
  }
  
  create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      age: { type: 'number', required: false }
    })
    db.push(ctx.request.body)
    ctx.body = ctx.request.body
  }
  
  update(ctx) {
    if (ctx.params.id * 1 >= db.length) {
      ctx.throw(412)
    }
    ctx.verifyParams({
      name: { type: 'string', required: true },
      age: { type: 'number', required: false }
    })
    db[ctx.params.id * 1] = ctx.request.body
    ctx.body = ctx.request.body
  }
  
  delete(ctx) {
    if (ctx.params.id * 1 >= db.length) {
      ctx.throw(412)
    }
    db.splice(ctx.params.id * 1, 1)
    ctx.status = 204
  }
}

module.exports = new UsersCtl()
```

# 7-3 云数据库 MongoDB Atlas

# 7-4 用 Mongoose 连接 MongoDB

安装 Mongoose

```
npm i mongoose --save
```

# 7-5 设计用户模块的 Schema

- 分析用户模块的属性
- 编写用户模块的 Schema
- 使用 Schema 生成用户 Model

app下新建models文件夹

app\models\users.js

```
const mongoose = require('mongoose')

const {
  Schema,
  model,
} = mongoose

const userScema = new Schema({
  name: {
    type: String,
    required: true
  },
})

module.exports = model('User', userScema)
```

```
model('User', userScema)

"User"即为MongoDB里面存储集合的名字
```

# 7-6 用 MongoDB 实现用户的增删改查

- 用 Mongoose 实现增删改查接口
- 用 Postman 测试增删改查接口

## 警告：此节开始出现插入无效！！！

# 8-1 Session简介

## Session的优势

- 相比 JWT，最大的优势在于可以主动清除Session
- session保存在服务器端，相对较为安全
- 结合 cookie 使用，较为灵活，兼容性较好

## Session的劣势

- cookie + session 在跨域场景表现并不好
- 如果是分布式部署，需要做多机共享 session 机制
- 基于 cookie 的机制很容易被 CSRF
- 查询 session 信息可能会有数据库查询操作

# 8-2 JWT简介

## 什么是JWT

- JSON Web Token 是一个开放标准(RFC 7519)
- 定义了一个紧凑且相对独立的方式，可以将各方之间的信息作为JSON对象进行安全传输
- 该信息可以验证和信任，因为啥经过数字签名的

## JWT的构成

### 头部（Header）

- typ：token的类型，这里固定位JWT
- alg：使用的hash算法，例如：HMAC SHA256 或者RSA

### Payload（有效载荷）

- 存储需要传递的信息，如用户ID 用户名等
- 包含元数据，如过期时间、发布人等
- 与Header不同 Payload可以加密

### Signature（签名）

- 对Header和Payload部分进行签名
- 保证Token在传输的过程中没有被篡改或者损坏

# 8-4 在 Node.js 中使用 JWT

安装 jsonwebtoken

```
npm i jsonwebtoken
```

# 8-5 实现用户注册

#10-2 个人资料的 Schema 设计

# 10-3 个人资料的参数校验

# 10-4 RESTful-API 最佳实践——字段过滤

- 设计 Schema 默认隐蔽部分字段
- 通过查询字符串显示隐藏字段