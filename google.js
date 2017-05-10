var request = require("request"),
    cheerio = require("cheerio"),
    url = "https://www.google.com/search?q=data+mining",
    // url = "https://www.google.com/search?q=data+mining&start=20&*",

    corpus = {},
    totalResults = 0,
    resultsDownloaded = 0;
var content='';

function callback () {
    resultsDownloaded++;

    if (resultsDownloaded !== totalResults) {
        return;
    }

    var words = [];

    // поместим все слова в словарь
    for (prop in corpus) {
        words.push({
            word: prop,
            count: corpus[prop]
        });
    }

    // сортируем массив основываясь на частоте вхождения слов
    words.sort(function (a, b) {
        return b.count - a.count;
    });

    // finally, log the first fifty most popular words
    console.log(words.slice(0, 20));
}

request(url, function (error, response, body) {
    if (error) {
        console.log("Не удалось получить страницу из за следующей ошибки: " + error);
        return;
    }

    // загружаем тело страницы в Cheerio чтобы можно было работать с DOM
    var $ = cheerio.load(body),
        links = $(".r a");

    links.each(function (i, link) {
        // получаем атрибуты href для каждой ссылки
        var url = $(link).attr("href");

        // обрезаем ненужный мусор
        url = url.replace("/url?q=", "").split("&")[0];
        console.log(i +'url = '+ url);

        if (url.charAt(0) === "/") {
            return;
        }

        // ссылка считается результатом, так что увеличиваем их количество
        totalResults++;

        // download that page
        request(url, function (error, response, body) {
            if (error) {
                console.log("Couldn’t get page because of error: " + error);
                return;
            }

            // load the page into cheerio
            var $page = cheerio.load(body),
                text = $page("body").text();

            // избавляемся от лишних пробелов и нечисловых символов.
            text = text.replace(/\s+/g, " ")
                .replace(/[^a-zA-Z ]/g, "")
                .toLowerCase();

            // content = cheerio.load($page);
            console.log($page("title").text()+123);
            console.log(url);
            console.log($page('#entity-description > span').text());

            // разбиваем по пробелу, чтобы получить список слов на странице
            // и перебираем их в цикле.
            text.split(" ").forEach(function (word) {

                //скорее всего, нам не нужно включать слишком короткие или слишком длинные слова,
                // так как они, скорее всего, содержат бесполезные для нас данные.
                if (word.length < 4 || word.length > 20) {
                    return;
                }

                if (corpus[word]) {
                    // если слово уже находится в словаре, нашей коллекции
                    // терминов, увеличиваем количество его вхождений на единицу.
                    corpus[word]++;
                } else {
                    // В противном случае, считаем, что встречаем его впервые.
                    corpus[word] = 1;
                }
            });

            // and when our request is completed, call the callback to wrap up!
            callback();
        });
    });
});