var should = require('should'),
        assert = require('assert'),
        request = require('supertest');
request = request('http://localhost:5000');

describe('/chooses', function(done) {
    it('should return json id of newly created choose and delete it', function(done) {
        request
                .post('/chooses')
                .field('title', 'Titre de test')
                .field('share', 'true')
                .attach('image_0', 'test/images/jacket1.png')
                .attach('image_1', 'test/images/jacket2.png')
                .expect(201)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err)
                        return done(err);
                    res.body.should.have.property('choose_id');
                    console.log(res.body.choose_id);
                    request
                            .del('/chooses?choose_id=' + res.body.choose_id)
                            .expect(200)
                            .end(function(err, res) {
                                if (err)
                                    return done(err);
                                res.body.should.have.property('message');
                                done();
                            });
                });
    });

    it('should return an error because missing url image', function(done) {
        request
                .post('/chooses')
                .expect(500)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err)
                        return done(err);
                    res.body.should.have.property('message');
                    done();
                });
    });

});
