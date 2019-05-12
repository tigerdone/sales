const MongoClient = require('mongodb').MongoClient;

var connector = {};
// mongodb://tigerdone:18328646311lihu@ds131942.mlab.com:31942/tigerdone
// mongodb://localhost:27017/sales
MongoClient.connect('mongodb://localhost:27017/sales', function (err, client) {
    if (err) throw err;
});
connector.sales  = client.db('sales').collection('order');
connector.users  = client.db('sales').collection('user');
connector.price  = client.db('sales').collection('price');
connector.store  = client.db('sales').collection('store');
module.exports = connector;

