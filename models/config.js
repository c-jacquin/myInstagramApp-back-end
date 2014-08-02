var Mongoose = require('mongoose-q')(require('mongoose')),
    Timestamps = require('mongoose-simpletimestamps').SimpleTimestamps,
    ObjectId = Mongoose.SchemaTypes.ObjectId;

configSchema = new Mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        require : true
    },
    phat : {
        type: Boolean
    },
    follow: {
        type: Boolean
    },
    sunset : {
        type : Boolean
    },
    sunrise : {
        type : Boolean
    }

});

configSchema.plugin(Timestamps);

module.exports = Mongoose.model("Config", configSchema);

