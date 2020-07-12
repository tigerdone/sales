module.exports = {
    port: 7003,
    session: {
        secret: 'sales',
        key: 'tiger',
        maxAge: 2592000000
    },
    mongodb:"mongodb://127.0.0.1:27017/sales",
    // mongodb: 'mongodb://tigerdone:18328646311lihu@ds131942.mlab.com:31942/tigerdone',
    mongodbDev: 'mongodb://tigerdone:18328646311lihu@ds249967.mlab.com:49967/sales'
};


