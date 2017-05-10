var mongoose = require('mongoose');
var artists = require('../models/artistsModel');
var request = require('request');
var ar = mongoose.model('artists');
var apiOptions = {
    server : "http://localhost:3012"
};

var _showError = function (req, res, status) {
    var title, content;
    if (status === 404) {
        title = "404, page not found";
        content = "Oh dear. Looks like we can't find this page. Sorry.";
    } else if (status === 500) {
        title = "500, internal server error";
        content = "How embarrassing. There's a problem with our server.";
    } else {
        title = status + ", something's gone wrong";
        content = "Something, somewhere, has gone just a little bit wrong.";
    }
    res.status(status);
    // res.render('generic-text', {
    //     title : title,
    //     content : content
    // });
};

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

exports.all = function (req, res) {
    artists.all(function (err, docs) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(docs)
    })
};

module.exports.artistsReadOne = function(req, res) {
    console.log('Finding artist details', req.params);
    if (req.params && req.params.artistid) {
        console.log('wtfs')
        ar
            .findById(req.params.artistid)
            .exec(function(err, artist) {
                if (!artist) {
                    sendJSONresponse(res, 404, {
                        "message": "artistid  not found"
                    });
                    return;
                } else if (err) {
                    console.log(err);
                    sendJSONresponse(res, 404, err);
                    return;
                }
                console.log(artist);
                sendJSONresponse(res, 200, artist);
            });
    } else {
        console.log('No artistid specified');
        sendJSONresponse(res, 404, {
            "message": "No artistid in request"
        });
    }
};

var getArtistInfo = function (req, res, callback) {
    var requestOptions, path;
    path = "api/artistsinfo/" + req.params.artistid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            var data = body;
            if (response.statusCode === 200) {
                console.log(data);
                callback(req, res, data);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};

module.exports.artistInfo = function(req, res){
    getArtistInfo(req, res, function(req, res, responseData) {
        // renderDetailPage(req, res, responseData);
    });
};

exports.findById = function (req, res) {
    artists.findById(req.params.id, function (err, doc) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(doc);
    })
};

exports.create = function (req, res) {
    console.log('controller');
    var artist = {
        // id: Date.now(),
        name: req.body.name
    };

    artists.create(artist, function (err, result) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(artist);
    })

};

exports.update = function (req, res) {
    artists.update(req.params.id, {name: req.body.name}, function (err, result) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.sendStatus(200);
    })
};

exports.delete = function (req, res) {
    artists.delete(req.params.id, function (err, result) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.sendStatus(200);
    })
};