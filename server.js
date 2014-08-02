//setup environement mode
process.env['NODE_ENV'] = process.env.DYNO ? 'production' : 'development';

var express = require('express'),
    app = express(),
    http = require('http'),
    passport = require('passport'),
    config = require('./config/config')[process.env['NODE_ENV']],
    mongoose = require('mongoose');

// Bootstrap db connection
mongoose.connect(config.mongo_uri, function(data) {
    console.log(config.mongo_uri);
    console.log(data);
});
//end of conf
// express settings
require('./config/express')(app, passport);

// bootstrap passport config
require('./config/passport/http')(passport);


//routes
require('./config/routes')(app, passport);

//template rendering email and other stuff
//todo we probably should remove this
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('view options', {layout: false, root: __dirname + '/views'});



Geolocation = require('./models/geolocation')
User = require('./models/user')
Posts = require('./models/post')
Phat = require('./models/phat')
Activity = require('./models/activity')
conf = require('./models/config')
Q = require('q')


app.listen(app.get('port'), function() {

    Q.all([
        Geolocation.remove({}),
        User.remove({}),
        Posts.remove({}),
        Phat.remove({}),
        Activity.remove({}),
        conf.remove({})
    ])

    console.log("API listening on port " + app.get('port'));
});
