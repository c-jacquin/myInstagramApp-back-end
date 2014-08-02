var User = require('../models/user'),
    Activity = require('../models/activity'),
    Config = require('../config/config')[process.env['NODE_ENV']],
    Emailer = require('../services/myNodeMailer')
    error = require('../services/error'),
    q = require('q');


exports.search = function(req,res){
    User.findQ({pseudo :  new RegExp(req.query.query, 'i')})
        .then(function(users){
            res.json(users);
        })
        .fail(function(err){
            error.emit('db',err, res);
        })
        .done()
    }

exports.getOne = function(req, res) {
    var id = req.params.id;
    console.log('id',id)
    User.findOneQ({_id : id})
        .then(function(user){
            res.json(200,user);
        })
        .fail(function(err){
            error.emit('db',err, res);
        })
};

exports.signIn = function(req,res){
    console.log(req.body)
    User.findOneQ({pseudo: req.body.pseudo})
        .then(function(user){
            console.log(user)
            if (!user) {
                error.emit('auth',new Error('user not found'), res);
            }else{
                user.comparePassword(req.body.password)
                    .then(function(){
                        res.json(user)
                    })
                    .catch(function(err){
                        error.emit('auth',err, res);
                    })
            }
        })
        .fail(function(err){
            error.emit('bdd',err, res);
        })
    }

exports.create = function(req, res) {
    var user = new User(req.body);
    if(!user.isAdult()){
        res.json(401,{message : "you muste be over 21"})
        return;
    }else{
        user.saveQ()
            .then(function(user){
                res.json(user);
            })
            .fail(function(err){
                console.log(err)
                error.emit('db',err, res);
            })
    }
};

exports.resetPasswordAccount = function(req,res){
    User.findOneQ({_id : req.body.userId})
        .spread(function(user){
            q.all([
                user.comparePassword(req.body.old),
                User.updateQ({_id : user._id},{password : req.body.new})
            ]).then(function(data){
                res.json({message : "password changed successfully !!"});
            })
            .catch(function(err){
                error.emit('auth',err, res);
            })
        })
        .fail(function(err){
            error.emit('db',err, res);
        })

    }


exports.resetPassword = function(req,res){
    var resetTimestamp = new Date().getTime() + 600000,
        passwordToken = require('hat')();
    User.updateQ({email : req.body.email},{reset_password_token : passwordToken,reset_password_timestamp : resetTimestamp})
        .spread(function(user){
            if(user == null) {
                error.emit('db',new Error('unknow email'));

                res.json(500,{message : 'unknow email'})
            }
            else {
                var options = {
                    email: user.email,
                    pseudo: user.pseudo,
                    subject: "FDTD reset password",
                    template: "resetPassword"
                };


                var data = {
                    pseudo: user.pseudo,
                    email: user.email,
                    token: user.reset_password_token,
                    domain: Config.public_url

                };

                var emailer = new Emailer(options, data);

                emailer.send(function (err, result) {
                    console.log(result)
                    if (err) {
                        error.emit('mail',new Error('unknow email'));
                    }
                });
            }
        })
        .fail(function(err){
            error.emit('db',err, res);
        })
        
  
    };

exports.resetPasswordPage = function(req,res){
    console.log('body',req.body)
    User.findOneQ({reset_password_token : req.query.token})
        .spread(function(user){
            if(user){
                var now = new Date();
                if(user.reset_password_timestamp >= now){
                    res.render('resetPassword',{user : user});
                }else{
                    error.emit('auth',new Error("too late you have 10 minutes to reset your password"))
                }
            }else{
                error.emit('auth',new Error('database error'));
            }

        })
        .fail(function(){
            error.emit('db',err, res);
        })
    }

exports.resetPasswordConfirm = function(req,res){
    User.findOneQ({_id : req.body._id})
        .then(function(user){
            var now = new Date();
            if(user.reset_password_timestamp >= now){
                var hashedPass = passwordCrytpo.hash(req.body.password);
                User.updateQ({ _id : user._id },{ password : hashedPass })
                    .then(function(){
                        res.json({message : "your password had been successfully changed"})
                    })
                    .fail(function(err){
                        error.emit('db',err, res);
                    })
            }else{
                error.emit('bdd',new Error('you took too long you must start again'))
            }
        })
        .fail(function(err) {
            error.emit('db',err, res);
        })

    }



exports.update = function(req, res) {
    var id = req.body._id;
    delete req.body._id;
    User.updateQ({_id: id},req.body)
        .then(function(){
            res.json(200,{message : 'user updated'});
        })
        .fail(function(err){
            error.emit('db',err, res);
        })
};

exports.uploadPic = function(req,res){
    /*var base64Data = req.body.image.replace(/^data:image\/png;base64,/,"");
    var base64Data = req.body.image.replace(/^data:image\/jpeg;base64,/,"");
    var base64Data = req.body.image.replace(/^data:image\/jpg;base64,/,"");*/

    User.updateQ({_id : req.body.user},{image : req.body.picture})
        .then(function(){
            res.json(200,{message : 'upload successfull'})
        })
        .fail(function(err){
            error.emit('db',err, res);
        })
    };

exports.follow = function(req,res) {
    console.log(req.body)
    var activity = new Activity({
        receiver: req.body.follow,
        emiter: req.body.me,
        type: 'follow'
    })
    q.all([
        User.updateQ({_id: req.body.me}, {$push: { following: req.body.follow }}),
        User.updateQ({_id: req.body.follow}, {$push: { follower: req.body.me }}),
        activity.saveQ()
    ]).then(function () {
        apn.sendNotification('follow', req.body.token, req.body.me);
        res.json(200, {});
    }).fail(function (err) {
        error.emit('bdd', err)
    })
}

exports.unfollow = function(req,res){
    q.all([
        User.updateQ({_id : req.body.me},{$pull : { following : req.body.follow }}),
        User.updateQ({_id : req.body.follow},{$pull : { follower : req.body.me }})
    ]).then(function(){
        res.json(200,{});
    }).catch(function(err){
        error.emit('db',err, res);
    })
}


exports.getFollowers = function(req,res){
    var query = User.findOne({_id : req.query._id},'follower');
    query.populate('follower')
    query.execQ()
        .then(function(user){
            res.json(user.follower);
        })
        .fail(function(err){
            error.emit('db',err, res);
        })
    }

exports.report = function(req,res){
    User.updateQ({_id : req.body.me},{$push : { reports : req.body.user }})
        .spread(function(){
            var options = {
                email: "paulbreton75@gmail.com",
                subject: "Report User",
                template: "reportUser"
            };
            var data = {
                userId : req.query.user,
                pseudo: req.query.pseudo,
                email : req.query.email
            };
            var emailer = new Emailer(options, data);
            emailer.send(function(err, result) {
                res.json({message : "reported"})
                if (err) {
                    error.emit('email',err);
                }
            });
        })
        .fail(function(err){
            error.emit('db',err, res);
        })

    }


exports.registerDeviceToken = function(req,res){
    console.log('bodyTokenreq',req.body);
    User.updateQ({_id : req.body.user},{deviceToken : req.body.token})
        .then(function(){
            console.log('tokenAdded');
            res.json({deviceToken : req.body.token});
        })
        .fail(function(err){
            console.log('erreur de token toussa',err);
            error.emit('db',err);
        });
    };