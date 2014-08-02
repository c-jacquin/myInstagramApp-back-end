var User = require('../../models/user'),
    BasicStrategy = require('passport-http').BasicStrategy;

module.exports = function(passport) {

    passport.use(new BasicStrategy(
            function(userid, password, done) {
                User.findOne({pseudo: userid}, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false);
                    }
//                    if (user.validAccessToken(password)) {
//                        return done(null, user);
//                    }
                    user.comparePassword(password)
                        .then(function(user){
                            return done(null, user);
                        })
                        .catch(function(err){
                            done(null, false, new Error('Incorrect password.',__filename));
                        })
                });
            }
    ));

};