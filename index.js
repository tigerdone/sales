const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const config = require('config-lite')(__dirname);
const pkg = require('./package');
const winston = require('winston');
const expressWinston = require('express-winston');
const cookieParser = require('cookie-parser');
const cookieSession = require('express-session');
const app = express();
const bodyparser = require('body-parser');
const indexRouter = require('./routes/index');
const admin = require('./routes/admin');
const checkLogin = require('./routes/check').checkLogin;


// 设置模板目录
app.set('views', path.join(__dirname, './views'));
// 设置模板引擎为 ejs
// app.set('view engine', 'ejs');

//设置cookie 中间件
app.use(cookieParser('sessionTest'));

app.use(session({
    name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true, // 强制更新 session
    saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
        maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
    }
}));
app.use(bodyparser.json()); // 使用bodyparder中间件，
app.use(bodyparser.urlencoded({ extended: true }));
// 设置静态文件目录
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

// 设置模板全局常量c
app.locals.blog = {
    title: pkg.name,
    description: pkg.description
};

// 路由
app.use('/',indexRouter);
app.use('/admin',admin);

// 监听端口，启动程序
if (module.parent) {
    // 被 require，则导出 app
    module.exports = app
} else {
    // 监听端口，启动程序
    app.listen(config.port, function () {
        console.log(`${app.locals.blog.description} ${pkg.name} listening on port ${config.port}`)
    })
}


