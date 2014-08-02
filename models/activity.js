var Mongoose = require('mongoose-q')(require('mongoose')),
    Timestamps = require('mongoose-simpletimestamps').SimpleTimestamps,
    ObjectId = Mongoose.SchemaTypes.ObjectId;

activitySchema = new Mongoose.Schema({
    type : {
        type :String,
        required : true
    },
    emiter: {
        type: ObjectId,
        ref: 'User',
        require : true
    },
    receiver : {
        type: ObjectId,
        ref: 'User',
        require : true
    },
    post: {
        type: ObjectId,
        ref: 'Post'
    }
});

activitySchema.plugin(Timestamps);

module.exports = Mongoose.model("Activity", activitySchema);

