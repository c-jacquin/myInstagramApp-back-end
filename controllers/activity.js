var Activity = require('../models/activity'),
    error = require('../services/error');

exports.retrieve = function(req, res){
    var query = Activity.find({receiver : req.query.user});
    query.limit(50);
    query.populate('emiter','image pseudo')
    query.execQ().then(function(data){
        res.json(data);
    }).fail(function(err){
        error.emit('db',err, res);
    })
}