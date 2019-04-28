const express = require('express');
const path = require('path');
// const poster = require('./poster');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
let ims;

// mongodb://tigerdone:18328646311lihu@ds131942.mlab.com:31942/tigerdone
// mongodb://localhost:27017/myblog
MongoClient.connect('mongodb://localhost:27017/myblog', function (err, client) {
    if (err) throw err;
    ims  = client.db('tigerdone').collection('ims')
});

router.get('/', function (req, res) {
    res.render('index');
});

module.exports = router;