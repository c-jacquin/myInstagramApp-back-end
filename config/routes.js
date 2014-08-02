var posts = require('../controllers/posts'),
    users = require('../controllers/users'),
    geolocations = require('../controllers/geolocations'),
    phats = require('../controllers/phats'),
    activity = require('../controllers/activity'),
    suncalc = require("../services/suncalc.js"),
    config = require("../controllers/config");

module.exports = function(app, passport) {

    app.post('/users/auth',users.signIn);

    app.post('/users', users.create);
    app.put('/users', users.update);
    app.get('/users/:id',passport.authenticate('basic', {session: false}),users.getOne);
    app.put('/users/picture',passport.authenticate('basic', {session: false}), users.uploadPic);
    app.put('/users/follow',passport.authenticate('basic', {session: false}), users.follow);
    app.put('/users/unfollow',passport.authenticate('basic', {session: false}), users.unfollow);
    app.put('/users/report',passport.authenticate('basic', {session: false}), users.report);
    app.get('/users/followers',passport.authenticate('basic', {session: false}), users.getFollowers);

    //search
    app.get('/search/users', passport.authenticate('basic', {session: false}), users.search);
    app.get('/search/posts', passport.authenticate('basic', {session: false}), posts.search);

    app.post('/password/reset',users.resetPassword);
    app.get('/password/reset',users.resetPasswordPage);
    app.post('/password/resetAccount', passport.authenticate('basic', {session: false}),users.resetPasswordAccount)
    app.post('/password/confirm',users.resetPasswordConfirm)

    app.post('/geolocations',passport.authenticate('basic', {session: false}), geolocations.push);

    // Posts
    app.post('/posts', passport.authenticate('basic', {session: false}), posts.create);
    app.delete('/posts/:post_id', passport.authenticate('basic', {session: false}), posts.delete);
    app.get('/posts', posts.retrieve);
    app.get('/posts/refresh',passport.authenticate('basic', {session: false}), posts.refresh);
    app.get('/posts/report',passport.authenticate('basic',{session : false}), posts.report);

    // Phat
    app.post('/phat', passport.authenticate('basic', {session: false}), phats.create);
    app.put('/unphat',passport.authenticate('basic', {session: false}), phats.remove);

    app.get('/activity',passport.authenticate('basic', {session: false}), activity.retrieve)

    //push notification
    app.post('/apn/token', users.registerDeviceToken);

    //sun timer
    app.post('/suncalc', suncalc.compute);

    //config
    app.put('/conf/notif', config.notification);

    app.get('/logout', function(req, res) {
        req.logout();
        res.send(200, {message: 'disconnected'});
    });
};
