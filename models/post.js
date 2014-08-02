var Mongoose = require('mongoose-q')(require('mongoose')),
    Timestamps = require('mongoose-simpletimestamps').SimpleTimestamps,
    Schema = Mongoose.Schema,
    ObjectId = Mongoose.SchemaTypes.ObjectId;

postSchema = new Mongoose.Schema({
    creator: {
        type: ObjectId,
        ref: 'User'
    },
    phats: [{
        type: Schema.Types.ObjectId,
        ref: 'User'}
    ],
    phatNumber : {
        type: Number,
        defaults : 0
    },
    title: {
        type: String
    },
    report : {
        type : Number,
        defaults : 0
    },
    public: {
        type : Boolean
    },
    tags: {
        type : Array
    },
    images: {
        type : String
    },
    images_small: {
        type : String
    },
    position : {
        type : ObjectId,
        ref : 'Geolocation'
    },
    description : {
        type : String
    },
    createdAt : {
        type : Date
    }
});


postSchema.plugin(Timestamps);

module.exports = Mongoose.model("Post", postSchema);