var Post = require('../models/post'),
    gm = require('gm'),
    imageMagick = gm.subClass({imageMagick: true});

exports.resizeTo = resize = function(err, done, image_url, dimension, post) {
    var imageResizing = imageMagick();
    var indexImage = 0;
    imageResizing.append(image_url).resize(dimension.width, dimension.height).autoOrient();
    var new_image_name = 'public/images/' + post.id + '_' + indexImage + '_resize.jpg';
    imageResizing.write(new_image_name, function() {
        done(new_image_name);
    });

};