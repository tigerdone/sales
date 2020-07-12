const router = require('express').Router();
let users;
const config = require('../config/default')

// mongodb://tigerdone:18328646311lihu@ds131942.mlab.com:31942/tigerdone
// mongodb://localhost:27017/sales
MongoClient.connect(process.env.NODE_ENV === 'development' ? config.mongodbDev : config.mongodb, function (err, client) {
    if (err) throw err;
    users  = client.db('sales').collection('user');
    price  = client.db('sales').collection('price');
    store  = client.db('sales').collection('store');
});

//-------------------login-------------------//
router.post('/login', function (req, res) {
    users.find().toArray(function (err, result) {
        if (err) throw err;
        let conSo =  result.find(function(item){
            return item.username === req.body.inputName && item.powerId === req.body.powerId && item.password === req.body.inputPassword;
        });
        if (conSo){
            req.session.user = conSo.username;
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
router.get('/userMessage', function (req, res) {
    // res.send({username:req.session.user});
    users.find({username:req.session.user}).toArray(function (err, result) {
        if (err) throw err;
        if (result.length !== 0){
            let box={};
            box.username = result[0].username;
            box.powerId = result[0].powerId;
            res.json(box);
        }
        else {
            res.sendStatus(404);
        }
    })
});