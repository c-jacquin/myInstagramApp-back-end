var Phat = require('../models/phat'),
    User = require('../models/user'),
    Post = require('../models/post'),
    Activity = require('../models/activity'),
    apn = require('../services/apn'),
    q = require('q'),
    error = require('../services/error');


module.exports = {
    create: function (req, res) {
        var phat = new Phat({
            user: req.body.user,
            post: req.body.post
        });
        var activity = new Activity({
            emiter: req.body.user,
            receiver: req.body.postCreator,
            post: req.body.posts,
            type: 'phat'
        })
        q.all([
            phat.saveQ(),
            User.findAndUpdateQ({_id: req.body.user}, { $push: {phats: req.body.post} }),
            Post.updateQ({ _id: req.body.post }, { $inc: { phatNumber: 1 } }),
            User.updateQ({ _id: req.body.postCreator }, { $inc: { phatNumber: 1 }}),
            activity.saveQ()
        ]).then(function (data) {
           //todo send notif
            apn.sendNotification('phat', req.body.token, data[1]);
            res.json(data[0]);
        }).catch(function (err) {
            error.emit('db', err, res);
        })
    },
    remove: function (req, res) {
        q.all([
            Phat.remove({user: req.body.user, post: req.body.post}),
            User.updateQ({_id: req.body.user}, { $pull: {phats: req.body.post} }),
            Post.updateQ({ _id: req.body.post }, { $inc: { phatNumber: -1 } }),
            User.updateQ({ _id: req.body.postCreator }, { $inc: { phatNumber: -1 }})
        ]).then(function () {
            res.json({});
        }).catch(function (err) {
            error.emit('db', err, res);
        })
    }
}