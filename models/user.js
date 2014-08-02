var Mongoose = require('mongoose-q')(require('mongoose')),
    Timestamps = require('mongoose-simpletimestamps').SimpleTimestamps,
    ObjectId = Mongoose.SchemaTypes.ObjectId,
    bcrypt = require('bcrypt-nodejs'),
    SALT_WORK_FACTOR = 10,
    q = require('q'),
    Config = require('../models/config');

var userSchema = new Mongoose.Schema({
    geolocations: [
        {
            type: ObjectId,
            ref: 'Geolocation'
        }
    ],
    pseudo: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    image: {
        type: String
    },
    reset_password_token: {
        type: String
    },
    reset_password_timestamp: {
        type: Date
    },
    gender: {
        type: String
    },
    description: {
        type: String
    },
    city: {
        type: String
    },
    bagde: {
        type: Boolean,
        default: true
    },
    sexOrientation: {
        type: String
    },
    relationship: {
        type: String
    },
    phats: [{
            type: ObjectId,
            ref: 'Post'
        }],
    phatNumber: {
        type: Number,
        defaults: 0
    },
    reportNumber: {
        type: Number
    },
    reports: [{
            type: ObjectId,
            ref: 'User'
        }],
    nightsNumber: {
        type: Number,
        defaults: 0
    },
    url: {
        type: String
    },
    follower: {
        type: [
            {
                type: ObjectId,
                ref: 'User'
            }
        ]
    },
    following: {
        type: [
            {
                type: ObjectId,
                ref: 'User'
            }
        ]
    },
    postNumber: {
        type: Number,
        defaults: 0
    },
    deviceToken: {
        type: String
    }
    ,
    cocktail: {
        type: String
    },
    place: {
        type: String
    },
    music: {
        type: String
    }
});

userSchema.pre('save', function(next) {
    var user = this,
        myConf = new Config({
            user : user._id
        });
    q.all([
        q.nfcall(bcrypt.genSalt, SALT_WORK_FACTOR),
        myConf.saveQ()
    ]).then(function(data){
        console.log(data)
        bcrypt.hash(user.password, data[0],null,function(err,hash){
            if(err){
                next(err);
            }else{
                user.password = hash;
                console.log(user);
                next();
            }
        })
    }).catch(function(){
        next(err);
    })
})


userSchema.methods.isAdult = function() {
    var now = new Date();
    var old = new Date(now.getFullYear() - 21, now.getMonth(), now.getDate());
    return this.birthdate.getTime() < old.getTime();
};

userSchema.methods.comparePassword = function(candidatePassword) {
    var defered = q.defer();
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) {
            defered.reject(err);
        } else {
            defered.resolve(isMatch);
        }
    });
    return defered.promise;
};


userSchema.plugin(Timestamps);
module.exports = User = Mongoose.model("User", userSchema);


