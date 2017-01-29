var express = require('express');
var bodyParser = require('body-parser');
// var db = require('.//db.js');
var db = require('C:/openserver/domains/pureNodeApi/db.js');
var ObjectID = require('mongodb').ObjectID;


var app = express();


app.use(bodyParser.json());
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
    db.get().collection('artists').find().toArray(
        function (err, docs) {
            if (err) {
                console.log("err getArtists");
                return res.sendStatus(500);
            }
        res.send(docs);
        }
    );
});

// получение по айди
app.get('/artists/:id', function (req, res) {
    //т.к все id_ это объекты необходимо конвертировать
    db.get().collection('artists').findOne(
        {
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
});

app.post('/artists', function (req, res) {
    console.log(req.body);

    var artist = {
        // id: Date.now(),
        name: req.body.name
    };

    // artists.push(artist);
    db.get().collection('artists').insertOne(artist, function (err, result) {
        if (err) {
            console.log('err collection')
            return res.sendStatus(500);
        }
        res.send(artist);
    })
});

//Находим объект по айди и обновляем его объектом с данными "name"
app.put('/artists/:id', function (req, res) {
    db.get().collection('artists').updateOne(
        { _id: ObjectID(req.params.id) },
        { name: req.body.name },
        function (err, result) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        }
    );
});

app.delete('/artists/:id', function (req, res) {
    db.get().collection('artists').deleteOne(
        {
            _id: ObjectID(req.params.id)
        },
            function (err, result){
                if(err)
                {
                    console.log(err);
                    return res.sendStatus(500);
                }
                res.sendStatus(200);
            }
    );

    // artists = artists.filter(function (artist) {
    //     return artist.id !== Number(req.params.id);
    // });
    // res.sendStatus(200);
});

db.connect('mongodb://localhost:27017/api', function (err) {
    if (err)
        return console.log(err);

    app.listen(3012, function () {
        console.log('api app started');
    });
});


