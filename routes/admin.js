const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const multer = require('multer'); // v1.0.5
const mongoose = require('mongoose');
const checkLogin = require('../middlewares/check').checkLogin;
const fs = require('fs');

const createFolder = function (folder) {
    try{
        fs.accessSync(folder)
    }catch (e) {
        fs.mkdirSync(folder)
    }
};
const uploadFolder = './public/image';
createFolder(uploadFolder);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });

let sales;
let project;
let users;
// mongodb://tigerdone:18328646311lihu@ds131942.mlab.com:31942/tigerdone
// mongodb://localhost:27017/myblog
MongoClient.connect('mongodb://tigerdone:18328646311lihu@ds131942.mlab.com:31942/tigerdone', function (err, client) {
    if (err) throw err;
    sales  = client.db('tigerdone').collection('salesDing');
    project  = client.db('tigerdone').collection('project');
    users  = client.db('tigerdone').collection('users')
});
router.get('/Data', function (req, res) {
    console.log(req.query.name);
    sales.find().toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
    })
});
router.post('/insertPaper', checkLogin, function (req, res) {
    let box = req.body;getProdata
    delete box._id;
    sales.insertOne(box, function(err) {
        if (err) throw err;
        console.log("1 document inserted");
    });
    res.sendStatus(200);
});
router.post('/updatePaper', checkLogin, function (req, res) {
    console.log("req.body._id"+req.body._id);
    let _id = mongoose.Types.ObjectId(req.body._id);
    let box = req.body;
    delete box._id;
    sales.update({_id:_id}, box , function(err) {
        if (err) throw err;
        console.log("1 document update");
    });
    res.sendStatus(200);
});
router.post('/deleteOne', checkLogin, function (req, res) {
    console.log("req.body._id"+req.body._id);
    let _id = mongoose.Types.ObjectId(req.body._id);
    let box = req.body;
    delete box._id;
    sales.deleteOne({_id:_id} , function(err) {
        if (err) throw err;
        console.log("1 document delete");
    });
    res.sendStatus(200);
});
router.post('/login', upload.array(), function (req, res) {
    users.find().toArray(function (err, result) {
        if (err) throw err;
        let conSo =  result.find(function(item){
            return item.username === req.body.inputName && item.password === req.body.inputPassword;
        });
        if (conSo){
            req.session.user = conSo.username;
            // res.sendStatus(200);
            res.send({isLogined:true});
        }
        else{
            res.send({isLogined:false});
        }
    });
});
router.get('/loginOut', function (req, res) {
    // req.session.user = null;
    req.session.destroy();
    // 登出成功后跳转到主页
    // res.redirect('/')
    res.sendStatus(200)
});

//----------project---------//
router.post('/uploadImage', checkLogin, upload.single('file'), function (req, res) {
    console.dir(req.file);
    res.sendStatus(200);
});
router.get('/checkLogin', function (req, res) {
    if (!req.session.user){
        return res.send({isLogined:false});
    }
    return res.send({isLogined:true});
});
router.get('/getProdata',function (req,res) {
    project.find().toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
    })
});
router.post('/proInsert', checkLogin, function (req, res) {
    let box = req.body;
    delete box._id;
    project.insertOne(box, function(err) {
        if (err) throw err;
        console.log("1 document inserted");
    });
    res.sendStatus(200);
});
router.post('/proDeleOne',checkLogin,function (req, res) {
    console.log("req.body._id"+req.body._id);
    let _id = mongoose.Types.ObjectId(req.body._id);
    let box = req.body;
    delete box._id;
    project.deleteOne({_id:_id} , function(err) {
        if (err) throw err;
        console.log("1 document delete");
    });
    res.sendStatus(200);
});


module.exports = router;
