var Mongoose = require('mongoose-q')(require('mongoose')),
    Timestamps = require('mongoose-simpletimestamps').SimpleTimestamps,
    ObjectId = Mongoose.SchemaTypes.ObjectId;

phatSchema = new Mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    post: {
        type: ObjectId,
        ref: 'Post'
    }
});

phatSchema.plugin(Timestamps);

module.exports = Mongoose.model("Phat", phatSchema);

