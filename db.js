var MongoClient = require('mongodb').MongoClient;


var state = {
    db: null
};

//Сохраняем подключение к бд, если делаем новое соединение то обращаемся к старому
exports.connect = function (url, done) {
    if (state.db) {
        return done();
    }

    MongoClient.connect(url, function (err, db) {
        if (err) {
            return done(err);
        }
        state.db = db;
        done();
    })
};

// db.get -  ссылка на бд
exports.get = function () {
    return state.db;
};