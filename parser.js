var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');

var URL = 'http://www.fontanka.ru/fontanka/2017/01/05/all.html';
var results = [];

var q = tress(function(url, callback){
    needle.get(url, function(err, res){
        if (err) throw err;

        // парсим DOM
        // console.log(res);
        var $ = cheerio.load(res.body);

        //информация о новости
        // console.log($('.calendar-list').text());
        // if($('.newslist__item').contents().eq(2).text().trim().slice(0, -1) === 'Алексей Козлов'){

        // // }
        // console.log($('.calendar-item-title>a:eq(0)'));
        // console.log($('a',this).eq(0).text());

        results.push({
            title: $('h1').text(),
            // title: $('h1'),
            // date: $('.calendar-item-date').text(),

            hrevf: url,
            // href: url.resolve(url,$('a',this).attr('href')),
            // href2: url,
            // href: url
            // size: $('.calendar-item-title>a').text().length
        });


        //список новостей
        $('.calendar-item-title>a').each(function() {

            // q.push($(this).attr('href'));
            // console.log($(this).attr('href'));
            // console.log($(this).text());

            q.push(resolve(URL, $(this).attr('href')));

        });


        callback();
    });
}, 10); // запускаем 10 параллельных потоков

q.drain = function(){
    fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));
};

q.push(URL);