var express = require('express');

var app = express();

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
app.get('/artists', function (req, res) {
    res.send(artists);
});

app.get('/artists/:id', function (req, res) {
    res.send('test');
});

app.listen(3012, function () {
    console.log('api app started');
});

