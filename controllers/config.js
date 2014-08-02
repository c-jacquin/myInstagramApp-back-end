var Config = require('../models/config'),
    error = require('../services/error');

module.exports = {
    notification : function(req,res) {
        console.log(req.body)
        Config.updateQ({user: req.body.user},  req.body)
            .then(function () {
                res.send();
            })
            .fail(function (err) {
                error.emit('db', err, res);
            })

    }
}