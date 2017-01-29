var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;


var app = express(),
    db;


app.use(bodyParser.json());
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// описываем гет на урл /  Заспрос/ответ
// отправляет ответ->send
app.get('/', function (req, res) {
    res.send('Hello api');
});


var artists = [
    {
        id: 1,
        name: 'Metallica'
    },
    {
        id: 2,
        name: 'Iron Maiden'
    }
];

//получение списка
app.get('/artists', function (req, res) {
    db.collection('artists').find().toArray(function (err, docs) {
        if (err) {
            console.log("err getArtists");
            return res.sendStatus(500);
        }
        res.send(docs);
    })

});

// получение по айди
app.get('/artists/:id', function (req, res) {
    //т.к все id_ это объекты необходимо конвертировать
    db.collection('artists').findOne({
            _id: ObjectID(req.params.id)
        },
        function (err, doc) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.send(doc)
        }
    );

    // console.log(req.params);
    // // res.send('test');
    // // console.log(artists[])
    // var artist = artists.find(function (artist) {
    //     return artist.id === Number(req.params.id);
    // });
    // res.send(artist);
});

app.post('/artists', function (req, res) {
    console.log(req.body);

    var artist = {
        // id: Date.now(),
        name: req.body.name
    };

    // artists.push(artist);
    db.collection('artists').insertOne(artist, function (err, result) {
        if (err) {
            console.log('err collection')
            return res.sendStatus(500);
        }
        res.send(artist);
    })
});


app.put('/artists/:id', function (req, res) {
    var artist = artists.find(function (artist) {
        return artist.id === Number(req.params.id);
    });
    artist.name = req.body.name;
    res.sendStatus(200);
});

app.delete('/artists/:id', function (req, res) {
    artists = artists.filter(function (artist) {
        return artist.id !== Number(req.params.id);
    })
    res.sendStatus(200);
});

MongoClient.connect('mongodb://localhost:27017/myapi', function (err, database) {
    if (err)
        return console.log(err);
    db = database;

    app.listen(3012, function () {
        console.log('api app started');
    });
})


