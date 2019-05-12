const path = require('path');
const express = require('express');
const session = require('express-session');
const config = require('config-lite')(__dirname);
const pkg = require('./package');
// const winston = require('winston');
// const expressWinston = require('express-winston');
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const index = require('./routes/index');
const admin = require('./routes/admin');
const app = express();

//设置cookie 中间件
app.use(cookieParser('sessionTest'));

//设置session中间件
app.use(session({
    name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true, // 强制更新 session
    saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
        maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
    }
}));

app.use(bodyparser.json()); // 使用bodyparder中间件
app.use(bodyparser.urlencoded({ extended: true }));

//打印成功信息
// app.use(expressWinston.logger({
//     transports: [
//         new (winston.transports.Console)({
//             json: true,
//             colorize: true
//         }),
//         new winston.transports.File({
//             filename: 'logs/success.log'
//         })
//     ]
// }));

// 设置静态文件目录
app.use('/', express.static(path.join(__dirname, 'public/admin')));
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));
app.use('/pdf', express.static(path.join(__dirname, './')));

// 路由
app.use('/',index);
app.use('/admin',admin);

//打印错误信息
// app.use(expressWinston.errorLogger({
//     transports: [
//         new winston.transports.Console({
//             json: true,
//             colorize: true
//         }),
//         new winston.transports.File({
//             filename: 'logs/error.log'
//         })
//     ]
// }));

// 监听端口，启动程序
if (module.parent) {
    // 被 require，则导出 app
    module.exports = app
} else {
    // 监听端口，启动程序
    app.listen(config.port, function () {
        console.log(`${pkg.description} ${pkg.name} listening on port ${config.port}`)
    })
}


