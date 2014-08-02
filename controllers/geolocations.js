var Geolocation = require('../models/geolocation'),
    User = require('../models/user'),
    error = require('../services/error'),
    q = require('q');
exports.push = function(req, res) {
    console.log(req.body)
    var geoloc = req.body;
    var geolocation = new Geolocation(geoloc);

    geolocation.saveQ().then(function(geoloc){
        User.updateQ({_id : req.body.creator},{$push: {geolocations: geoloc._id}},{safe: true, upsert: true}).then(function(){
            res.json(200,geolocation);
        }).fail(function(err){
            console.log(err);
            error.emit('db',err, res);
        })
    }).fail(function(err){
        error.emit('db',err, res);
    })
}
