var util = require('util');
var EventEmitter = require('events').EventEmitter;


//todo write in a file
var Error = function() {
    var self = this;
    this.on('auth', function(err,res) {
        console.error(err)
        res.json(304,err)
    });

    this.on('db', function(err,res) {
        console.error(err);
        res.json(500,err)
    });

    this.on('email', function(err,res) {
        console.error(err);
        res.json(500,err)
    });

    this.on('img', function(err,res) {
        console.error(err);
        res.json(500,err)
    });
};

util.inherits(Error, EventEmitter);

module.exports = new Error();