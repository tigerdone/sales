
项目调试运行 npm run start

项目启动运行 node app.js

项目启动后必须先添加超级管理员 暂时只能手动在控制台添加 命令如下

```js

db.createCollection('order')
db.createCollection('user')
db.createCollection('price')
db.createCollection('store')


db.user.insert({"orders": 0,"password": "supermanage","powerId": "2","username": "supermanage"})
db.price.insert({'adultPrice': 80, 'childPrice': 40, 'plupPrice': 50, 'clothPrice': 30})

```

## 查询磁盘使用量
find / -size +100M -exec ls -lh {} \;

## 查询历史使用命令
history

## 本地调试
在config/default.js文件中修改成远程数据库，即可连接远程数据库
// mongodb:"mongodb://120.78.205.46:27017/sales",
需要把阿里云安全组的对应额端口打开27017
