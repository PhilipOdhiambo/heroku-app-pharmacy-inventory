
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

// Instantiate database connections
const connection = 'mongodb+srv://philip:godcop@philip1-syx4i.mongodb.net';

module.exports.connect = function connect(callback) {
    MongoClient.connect(connection, {useNewUrlParser: true, useUnifiedTopology: true},(err, connection) => {
        /* exports the connection */
        module.exports.db = connection.db('bincard');
        callback(err);
    });
};
