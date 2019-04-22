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
    ims.find().toArray(function (err, result) {
        if (err) throw err;
        let dataoneOrder = [];
        let dataPatent = [];
        let dataSoftware = [];
        let dataAwards = [];
        result.forEach(function (item) {
            if(item.type === "oneOrder"){
                dataoneOrder.push(item)
            }
            if(item.type === "patent"){
                dataPatent.push(item)
            }
            if(item.type === "software_copyright"){
                dataSoftware.push(item)
            }
            if(item.type === "awards"){
                dataAwards.push(item)
            }
        });
        res.render('index',
            {
                dataoneOrder:dataoneOrder,
                dataPatent:dataPatent,
                dataSoftware:dataSoftware,
                dataAwards:dataAwards
            });
    })
});

router.get('/pdf', function (req, res) {
    res.download(path.join(__dirname, '../public/ims/pdf/CV_QinWu_November6_2018.pdf'));
});

module.exports = router;