const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const multer = require('multer'); // v1.0.5
const mongoose = require('mongoose');
const checkLogin = require('./check').checkLogin;
const fs = require('fs');
const moment = require('moment');
const path = require("path");
const createFolder = function (folder) {
    try{
        fs.accessSync(folder)
    }catch (e) {
        fs.mkdirSync(folder)
    }
};
const getword = require("../pdf/pdf1.js");

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
let users;
let price;
let store;

// mongodb://tigerdone:18328646311lihu@ds131942.mlab.com:31942/tigerdone
// mongodb://localhost:27017/sales
MongoClient.connect('mongodb://localhost:27017/sales', function (err, client) {
    if (err) throw err;
    sales  = client.db('sales').collection('order');
    users  = client.db('sales').collection('user');
    price  = client.db('sales').collection('price');
    store  = client.db('sales').collection('store');
});

// ------------order--------------//
router.get('/Data', function (req, res) {
    if (req.session.user === "supermanage") {
        sales.find().toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        })
    }
    else{
        sales.find({saler:req.session.user}).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        })
    }
});
router.get('/price', function (req, res) {
    price.find().toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
    })
});
router.post('/updateoneOrder', checkLogin, function (req, res) {
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
    let _id = mongoose.Types.ObjectId(req.body._id);
    let box = req.body;
    delete box._id;
    sales.deleteOne({_id:_id} , function(err) {
        if (err) throw err;
        console.log("1 document delete");
    });
    res.sendStatus(200);
});
router.post('/insertoneOrder', checkLogin, function (req, res) {
    let box = req.body;
    delete box._id;
    box.time = moment(Date.now()).format("YYYY-MM-DD");
    box.saler = req.session.user;
    users.find({username:box.saler}).toArray(function (err, result) {
        box.orderNum = box.time+ "-" + box.saler + "-"  + (++result[0].orders);
        sales.insertOne(box, function(err) {
            if (err) throw err;
            console.log("1 document inserted");
            let inputMessage = {
                time:box.time,
                adultPrice:box.adultPrice,
                personAll:parseInt(box.adultNum)+parseInt(box.childNum),
                totalLow:box.totalLow,
                childNum :box.childNum,
                adultNum :box.adultNum,
                cloth:parseInt(box.adultNum)+parseInt(box.childNum),
                plup:box.adultNum,
                totalUp:box.totalMoney,
                phone:box.phoneNumber,
            };
            getword.getword(inputMessage,"addblack");
            getword.getword(inputMessage,"addbule");
            getword.getword(inputMessage,"addRed");
            getword.getword(inputMessage,"addYellow");
        });

        res.sendStatus(200);
    });
});

//-----------login------------//
router.post('/login', upload.array(), function (req, res) {
    users.find().toArray(function (err, result) {
        if (err) throw err;
        let conSo =  result.find(function(item){
            return item.username === req.body.inputName && item.powerId === req.body.powerId && item.password === req.body.inputPassword;
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
    // res.redirect('/')
    res.sendStatus(200);
});
router.get('/getSaler', function (req, res) {
    // res.send({username:req.session.user});
    users.find({username:req.session.user}).toArray(function (err, result) {
        if (err) throw err;
        res.json(result[0]);
    })
});

// ----------user-setting-----------//
router.get('/users', function (req, res) {
    users.find().toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
    })
});
router.post('/deleteuser', checkLogin, function (req, res) {
    let _id = mongoose.Types.ObjectId(req.body._id);
    let box = req.body;
    delete box._id;
    if (box.username === "supermanage"&&box.password === "supermanage") {
        res.send({message:"无法删除本用户名"});
    }
    else {
        users.deleteOne({_id:_id} , function(err) {
            if (err) throw err;
            console.log("1 document delete");
        });
        res.sendStatus(200);
    }
});
router.post("/insertuser", checkLogin, function (req, res) {
    let box = req.body;
    delete box._id;
    users.find().toArray(function (err, result) {
        if (err) throw err;
        let conSo =  result.find(function(item){
            return item.username === box.username;
        });
        if (conSo){
            res.send({message:"用户名号被注册了"});
        }
        else{
            users.insert(box, function(err) {
                if (err) throw err;
                console.log("1 document inserted");
            });
            res.sendStatus(200);
        }
    });
});
router.post("/updateuser", checkLogin, function (req, res) {
    let box = req.body;
    let id = mongoose.Types.ObjectId(box._id);
    delete box._id;
    users.update({_id:id},box, function(err) {
        if (err) throw err;
        console.log("1 document inserted");
    });
    res.sendStatus(200);
});

// -------------setPrice---------------//
router.post('/setprice', checkLogin, function (req, res) {
    let box = req.body;
    price.insert(box, function(err) {
        if (err) throw err;
        console.log("1 document inserted");
    });
    res.sendStatus(200);
});
router.post('/updatePrice', checkLogin, function (req, res) {
    let box = req.body;
    let id = mongoose.Types.ObjectId(box._id);
    delete box._id;
    price.update({_id:id}, box, function(err) {
        if (err) throw err;
        console.log("1 document inserted");
    });
    res.sendStatus(200);
});

// -----------Store--------------//
router.get('/getstore', function (req, res) {
    store.find().toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
    })
});
router.post("/insertStore", checkLogin, function (req, res) {
    let box = req.body;
    delete box._id;
    store.find().toArray((err, result) =>{
        if (err) throw err;
        let conSo =  result.find(function(item){
            return item.name === box.name;
        });
        if (conSo){
            res.send({message:"有相同的物品了"});
        }
        else{
            store.insert(box, function(err) {
                if (err) throw err;
                console.log("1 document inserted");
            });
            res.sendStatus(200);
        }
    });
});
router.post("/updateStore", checkLogin, function (req, res) {
    let box = req.body;
    let id = mongoose.Types.ObjectId(box._id);
    delete box._id;
    store.find({_id:id}).toArray((err, result) =>{
        if (err) throw err;
        box.total = parseInt(result[0].total)+parseInt(box.total);
        store.update({_id:id},box, function(err) {
            if (err) throw err;
            console.log("1 document inserted");
        });
    });
    res.sendStatus(200);
});
router.post("/deleStore", checkLogin, function (req, res) {
    let _id = mongoose.Types.ObjectId(req.body._id);
    let box = req.body;
    delete box._id;
    store.deleteOne({_id:_id} , function(err) {
        if (err) throw err;
        console.log("1 document delete");
    });
    res.sendStatus(200);
});

// ----------------checkLogin----------------//
router.get('/checkLogin', function (req, res) {
    if (!req.session.user){
        return res.send({isLogined:false});
    }
    return res.send({isLogined:true});
});

module.exports = router;
