var Post = require('../models/post'),
    Phat = require('../models/phat'),
    Config = require('../config/config')[process.env['NODE_ENV']],
    http = require('http'),
    User = require('../models/user'),
    image_processor = require('../services/image_processor'),
    fs = require('fs'),
    path = require("path");
    Emailer = require('../services/myNodeMailer'),
    FUS3 = require('fetch-upload-s3'),
    fus3 = new FUS3('ChoozForMeBucket'),
    error = require('../services/error');

exports.search = function(req,res){
    Post.findQ({description :  new RegExp(req.query.query, 'i')})
        .then(function(posts){
            res.json(posts);
        })
        .catch(function(err){
            error.emit('db',err, res);
        })
}


exports.refresh = function(req,res){
    var query = Post.find({public: true, createdAt : { $gte : new Date( parseInt(req.query.date)) }});
    query.execQ().then(function(posts){
        res.json(posts);
    }).fail(function(err){
        error.emit('db',err)
    })
}

//dont seem to work with mongoose
exports.retrieve = function(req, res) {
    var query = Post.find({public: true});
    query.skip(req.query.start);
    query.limit(req.query.number);
    switch(req.query.type){
        case 'now':
            query.sort({createdAt: -1});
            break;
        case 'featured':
            query.sort({phatNumber : -1})
            break;
    }
    query.populate('creator','pseudo');
    query.execQ().then(function(posts){
        res.json(posts);
    }).catch(function(err){
        error.emit('db',err, res);
    })
};


exports.report = function(req,res){
    Post.updateQ({_id : req.query.post},{ $inc : {report : 1 }})
        .then(function(){
            var options = {
                email: "paulbreton75@gmail.com",
                subject: "Report post",
                template: "reportPost"
            };

            var data = {
                postId : req.query.post,
                pseudo: req.query.pseudo,
                email : req.query.email
            };

            console.log('mail send !!!! ',req.query);
            var emailer = new Emailer(options, data);

            emailer.send(function(err, result) {
                res.json({message : "reported"})
                if (err) {
                    error.emit('email',new Error("error not reported"),res);
                }
            });
        })
        .fail(function(err){
            error.emit('db',err, res);
        })
}

//todo remove the file from amazon (or not?)
exports.delete = function(req, res) {
    var postId = req.params.post_id;
    q.all([
        Post.removeQ({_id: postId}),
        Phat.removeQ({ post : postId })
    ]).then(function(){
        res.json(200, {message : 'post deleted'});
    })
        .fail(function(err){
            error.init('db',err);
        })
};


exports.create = function(req, res) {
    var imagesFiles = processFiles(req.files);
    var image = imagesFiles[0];
    console.log(image);
    var images = '';
    var options = {
        public: req.body.public ? true : false,
        creator: req.body.creator,
        description: req.body.description,
        images_small: ''
    };

    var post = new Post(options);
    post.saveQ().then(function(savedPost){
        console.log('savedPost : ', savedPost);
        savedPost.images_small = '';
        image_processor.resizeTo(
            function(err) {
                error.emit('img',err);
            },
            function(newSmallImage) {
                savedPost.saveQ().then(function(reSavedPost){
                    var newFileName = image.split('/')[2];
                    var newSmallFileName = newSmallImage.split('/')[2];
                    fus3.init(function() {
                        fus3.uploadFile(newSmallImage, newSmallFileName, function(err, data) {
                            if(err){
                                error.emit('img',err, res);
                            }else{
                                reSavedPost.images_small = Config.aws_s3_url + newSmallFileName;
                                fus3.uploadFile(image, newFileName, function(err, data) {
                                    if(err){
                                        error.emit('img',err);
                                    }else{
                                        console.log('success', data)
                                        images = Config.aws_s3_url + newFileName;
                                        reSavedPost.images = images;
                                        reSavedPost.save();
                                        res.json(201, reSavedPost);
                                    }
                                });
                            }
                        });
                    });
                }).fail(function(err){
                    error.emit('db',err);
                });
            }, image, {height: Config.thumbs.height, width: Config.thumbs.width}, post
        );

    }).fail(function(err){
        error.emit('db',err);
    });
};


function processFiles(files) {
    var filesArray = new Array();
    var count, key;
    for (key in files) {
        if (files.hasOwnProperty(key)) {
            var oldPath = files[key].path;
            var newPath = files[key].path + '.jpg';
            fs.renameSync(oldPath, newPath);
            var pathName = path.basename(newPath);
            filesArray.push('public/images/' + pathName);
            count++;
        }
    }
    return filesArray;
}

