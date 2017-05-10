var express = require('express');
var bodyParser = require('body-parser');
var db = require('C:/openserver/domains/pureNodeApi/db');
var artistsConroller = require('C:/openserver/domains/pureNodeApi/controllers/artistsController');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// описываем гет на урл /  Заспрос/ответ
// отправляет ответ->send
app.get('/', function (req, res) {
    res.send('Hello api');
});

//получение списка
app.get('/artists',artistsConroller.all);

// получение по айди
app.get('/artists/:id', artistsConroller.findById);
app.get('/artistsinfo/:artistid', artistsConroller.artistInfo);
app.get('/api/artistsinfo/:artistid', artistsConroller.artistsReadOne);

app.post('/artists', artistsConroller.create);

//Находим объект по айди и обновляем его объектом с данными "name"
app.put('/artists/:id', artistsConroller.update);

app.delete('/artists/:id', artistsConroller.delete);

db.connect('mongodb://localhost:27017/api', function (err) {
    if (err)
        return console.log(err);

    app.listen(3012, function () {
        console.log('api app started');
    });
});


