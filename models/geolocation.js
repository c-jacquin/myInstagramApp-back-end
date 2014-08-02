var Mongoose = require('mongoose-q')(require('mongoose')),
    Schema = Mongoose.Schema,
    Timestamps = require('mongoose-simpletimestamps').SimpleTimestamps,
    ObjectId = Mongoose.SchemaTypes.ObjectId;

geolocationSchema = new Mongoose.Schema({
    creator: {
        type: ObjectId,
        ref: 'User'
    },
    timestamp: Date,
    coords: {
    accuracy: Number,
    altitude: String,
    altitudeAccuracy: String,
    heading: String,
    latitude: Number,
    longitude: Number,
    speed: Number
    }
});

geolocationSchema.plugin(Timestamps);

module.exports = Mongoose.model("Geolocation", geolocationSchema);