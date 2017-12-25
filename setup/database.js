var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var configs = require('../setup/configs.json');

var url = configs.mongodb_uri;

exports.connect = function(callback) {
    MongoClient.connect(url, {

        connectTimeoutMS:9000000,
        socketTimeoutMS:9000000,
        wtimeout:9000000
    },function(err, database) {
        if(err) {
            console.log("Connected to server failed");
            callback(err, null);
        }else {
            console.log("Connected to server");
            callback(null, database);
        }
    });
};

