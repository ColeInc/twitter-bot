'use strict';

const fs = require('fs');
const tumblr = require('tumblr.js');
const Twit = require('twit');
const request = require('request');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser

let data = fs.readFileSync('../authentication.json'); //make this async?
let authDetails = JSON.parse(data);

function fetchFromTumblr(x, callback) {

    var client = tumblr.createClient(authDetails.authentication.tumblr);

    client.blogPosts('pradaindustries', { limit: 1 }, function (err, resp) {
        if (!err) {
            var postURL = resp.posts[0].image_permalink;
            // console.log(postURL);
            callback(null, postURL);
        } else {
            callback(new Error("An error has occurred"));
        }
    });
}

function postToTwitter(base64image, callback) {

    var T = new Twit({
        consumer_key: authDetails.authentication.twitter.consumer_api_key,
        consumer_secret: authDetails.authentication.twitter.consumer_api_secret_key,
        access_token: authDetails.authentication.twitter.access_token,
        access_token_secret: authDetails.authentication.twitter.access_token_secret
    })

    // var base64image = '/9j/4AAQSkZJRgABAQEASABIAAD/7QBuUGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAFIcAVoAAxslRxwCAAACAAAcAnQAPsKpIERpZ2l0YWwgQ2xvdWQgLSBodHRwOi8vd3d3LnJlZGJ1YmJsZS5jb20vcGVvcGxlL0RpZ2l0YWxDbG91/+0AblBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAABSHAFaAAMbJUccAgAAAgAAHAJ0AD7CqSBEaWdpdGFsIENsb3VkIC0gaHR0cDovL3d3dy5yZWRidWJibGUuY29tL3Blb3BsZS9EaWdpdGFsQ2xvdf/bAEMABgQFBQUEBgUFBQcGBgcJDwoJCAgJEw0OCw8WExcXFhMVFRgbIx4YGiEaFRUeKR8hJCUnKCcYHSsuKyYuIyYnJv/CAAsIAIAAgAEBEQD/xAAbAAADAQEBAQEAAAAAAAAAAAAEBQYDAQIAB//aAAgBAQAAAAH9FXz8jUTtwR1bIuSYcP795Bl0TUDotipl6PZdLEftSaPLyH6NZCxnzn5Hl+oTU9Qj4zFnSr46l8qhVdZOcoVTY5xNpk9bnK0Kr3kzLn37N/mpmCcEL72kLZsJNp27TQ/3Gq5xmSHmznTRLdR4T/NQGgNcln2a/QSuOF8ihKWo1SmQsdFBTuhJToUoNANRZJ8G8uT5Z5LxRzmi+9zXIW6ZXmZ7xy449q69TmE5Gm9GToNd6aKwv1mFCx1IVBvX2QADeawtFQ3MjBVdKz5gCOo8Nu4E8z6ordjFWaoYf//EACgQAAICAQQBBAICAwAAAAAAAAECAwQAERITIQUiJDIzIzEQNBQlQv/aAAgBAQABBQI5ONTL6mh7dhyLMvuYCoj5EP8AFmXjFi27mDdL45gJYrMJTFOhkX+JcD+/RDzh9mTIeeWCXAZozTO+PyuvHXA3pfrRvu4p7QXGjKuB1I20TvoqH3un+zn+N5hHNY8hABBaSaSouzPIJujMW4NSJyurtDIDpMMTQ475dmxH/PH6vLWG9fl13V4KjyZRplDEAG8hahQJKC8J6n+KWFbLaECP92remOzPldd01RtfIW3995P66ajjHQ8rYnjyzWnGLE0T1yeOeTqZvVA3LX2FZ9wyRspqUSmNstptL/km9p499YwNc4k32p0V5Z0Zkk1Ex1yQZ43usmkjIScqRcr8weWD7bf9uy2/xXjZchbrytziUctnJKxVIWkB06lXPFfVW++PxrKthcg0SSk+tm6NJlO/xNTponPG1QGWe3DHktiSXIUYnTqXPH+mGt9j+rH0CSPlDqbya/n8eu+vBkB6K7x/gKSaiLjoFx2GTPlc6VYj6r544iC2SgnKZ9XlB7iCbgtsOKxVbIiBjTLpLYXJ7GPLhbcT6VRtGvvyzlJFWVXyE8cl71PaXQzOZK0Vsri+ROPeZsadjhc4cprq3/MZyrHtyRhk/afMk8mWV1EEmxtNrKuucJwpphGBdTGOpOoterL3lUTT4bDOCdMWXkR/nKNHT1CuO9vUkebO/hlZPxyv+NcvkcdgjHOrMMgbbi/2LK5D8ov2g6kGEAY+WG442OqqcsTnboNX+WNgIM1vqWP7Il1wsEQBjkyiNa65bbRT+/3jOWfdneR9mRdGgOuXfsX5w/pu3HQtdZrtSTskYej/AP/EADQQAAEDAQUGBAUDBQAAAAAAAAEAAhEDEBIhMWEgMkFRUnEEE0LBImJyobEUgZEjM2OC8P/aAAgBAQAGPwJQnU9LH4YkfhOPO6hJhb1sArjeplSfUMURyNkiwlMHMwo4pzumsPuFdnRT5hWdsuQZfbjgQAnUnZHdXxZHNFp4bDTqnNVXWqPwqdQ5GFDSJ0QY/C9koRV0EtnkhDMuS8jxAi7uP9kWP3gtRko4FYqEDyVfQKm0+qt7qOIxWAJV52dhZMnYFOrmN1y7WQ3FFzkxo4uxXiHdWSpaGUO6EWNp+GaXPcgH/E92ZAXFCbJQvZOCLCtVoPyjWdmclKqaFU3fN7IWeZxCvSMFOwRycg71N+EolX3YUmK63dCGpTk13It/Ciy4Diib2CkEkrEW1O6frKd+pf5fytxQosEMCdPBUp4u9k4qoOkhBYZrzPFPFQdKu06a3YWNru6c5Fzyp4kyjqVRP+UJyr0uphjYkhYDYnmUVHEi6vlCKb9Qd9076lTPDiqlPkdvBU6fSJQbqobjcWQjuphCcjgnH9/5Uqn4gbzf6b/bbv8ASnv5BSr7xnitJRKj+E2Ti+n9winMd/beIco2hTHDNVB2FnxCB9CuuA0UHlYx/qbmqkcDbGyHH1Y/snfO6bIWJUgRNkc8FHU1HSwbGpOAVSMmxTb7qLG070uzKxxNsBU3f9knDnjbJUlSU7xLvTuDVNpcsT3tJ5ldlKu2OC7NTbOy1WOLkxv+xRNv/8QAJhABAAICAgEDBQEBAQAAAAAAAQARITFBUXFhgaEQkbHB8NHh8f/aAAgBAQABPyGK7iZgCjSfMJbm4RGz99sZd081ZYczhh95Y8zOP0AK4e35TZ+4b6jy5/2NqYxeJbnEc+gsw7KXPDDBmDmZ5oyelTCIURLfeIC16XCNqpTPMotHVLDMYJGc2veC3vtcR7hxLqbU1MYTEBe3UF1lvEhDS7fmDD/5B/s5l8+aqXh+pv5jXl1JINxpmtXGYtt39JY2KUVJalzSWfzUcRwPrGd6MuzqPIhvVmYW0WtzHfrMiGGz9mD5b+z/ACeqgH4ZQvtEH8avEADogIPoSwGC4OcdvxGV8HL4Z5SsTkhpXw68w7paIOwcR9vJXpcE5w32YJYJp0etytl4g9CUgOq3BcsnW1Rce5XRDcmpSo9h3D8yOuJzKNMoDlw7T0/MH1i+3uZlvmLgNLRLfCsGKUIgWVzXBXiHmUlUPB9NkYcRs+YEmLQ7OH8xAcUb6O4DfvkOjDWn/kAgbg83O53v+kiiNht4OFLcOpCDsc4SoEFimciw4OoWO8QFrFl1pOllWK+TuBPDCP30McSbPmUry69Lr9x2pgtk61sBD37lBRrgKmMKpbsSNKQle0FvV/pMPSP5nBwq+0BWFp++vipskK2fB+ZQHc7H+0ZhqmXmYSo83vpppoCBSHMteUNT3XvB6KF9O4mtlGMTwWV0/wDFBrBy/Kf5Kh5gPRczPHX44+IFlsykL6oS8wFaZfzFEyeIq1w681CE/m47vRYruZ1aPKDbDplIt+5NSzf7IgdGKNdPs7fbHtKJgTU4ypvWPjXbLVGPynKf/WUU9twTtZvLGN8IBoBhpbEixqA9xItbi/iFndK/D7Mu+1MDjGjEXb6K1QSpDJdsR/fLf6htlPPUZH7ihyHIcswQKpiYyNQiMJj3wzI8sp4ZedRUDsm6gXSelHgIG3Mq5G+x/MZ7rT44+YoV7K/aKricBMFhk/RvvDJNrdn98QTDanBDTQIOGuLWBoAup2PE6FPssv7uMHXMogW2yy9dTYXqMWhEXENDwZ8z0w/MDoARhSVSp8CO4Dht0dSysbu4pw8D/dRrrP3iKvCOVGGXqrg69JhdQt7Ymm3UWhxKFtoWfiKrY0TBJrmF9nmOjF8CO15kSy3X/P8AvWJd2y9WGH//2gAIAQEAAAAQBAaIljx50IA3p6nDIy2vWQuuX6svDXZ0uHNByiSA0en/xAAlEAEAAgEDBAIDAQEAAAAAAAABABEhMUFRYXGBkaGxwdHh8PH/2gAIAQEAAT8QyeXiIRoqmQoI3ihbUG4DdJhqv7KLtimFp8NksjLRau85+pU7G5UApXcQHxaFpyEXODghf0gNxd7ufBK1UQXOFFu+PLpEaWVPKPYW3SI3VYLWicxKWGX9Cu8NuaLugp9wnYkpyX/ZcbhIa1f1BOnazoq/mWB4VkD1LxNteYt6pMy/B0uFNUh0jnTEz1IxY9ogoCOilLKdxL9nEDu1UyXA+GAhVZ6mydKzLbcms7P90iAuKhyxbNDS4upUgjpmz8TAzR0sf1HKOyzRdb5m65QI5QkfEEGGFte+he3WDMMALXSAtvQ6xrWLM1xpFSTNulxJqOgXTq51q4GTHx5WXF5W11Cn00vy8/ccF2G3Y/TPuUq4M5+fqM5XlBEBzpeYMcSttlRZ6CIMGh2F0/dQOebRzg07GXRKWdMaHyPiXBl7YHljpDUMXStB2lBodqxhDHGyJ6UtXEYR8wmoVHgjFG3MfyOihozwzqPEwZlQXG7wwu+GipqdWm6/64s1vgvk+F9xLabsoUfUN4XI2/Jf3KR2WHUhyNVtLNrQ0h31CLRXGDaW7fGgPELWyVS4hmaNEhEvxBYlLECTeBrvqfZk6QyODHkS1KhYG5duc7RQW6VTrbHJfxMyhhTRNPktHfpHbk5O63NZAbL1L+od4ZxOKMunVAawCDJvG1DoKCor1zHNRJV+67bQ/eVcb4jZuJeGBd8AH7uP/b69Xd0oeprohGd78DqwcXaLszVu7WXuyrIVClU6UcDBfV3jVZ31dS5epU30qI/mxzupPxEQmbqC03cSCFlHCDsK6qWUeI4/iWjJnLxNZqppl6S2pWAophW7oGttGC2ygwcKn6lBxsYTJpDZavPaUVAEW7Oi83W+rmYWyWta/wBjJTAzS1V8ys2wdjI/MxcvpYv8EW6q6g7NBi9mVBDN3eB9NIxRcQQPE7JOAbuCEYNCOXAl9Ql8KK6Az8sWHqqDlf8AqVI/aga92IgNLWHAeB8pVWR1eQcfmXNgWuiUlbGEh3u428AHmg+pePTaeKwyyymjK2yaWV1IS0Coely9HCLaZQdb1+oJaECk4a570e5ddWBqsuvVz/iVbbQcGjTWCaNCAVtiZMs31VVfwsrVABiqpEKeA8gwHz8QVQi3CheUd0MQGhpmLGEy6sJkB9wsCXGbmEaHWDuyB5O8YcoC9W7SiBhwst9FHuUcmUtsjgK+Ygx2lL1i0JsWhQMJXYH2uEVzqHs/MqHAW+Cv3goAccSh2vrAEEubiSrnrLHPmLZGaJVd7cJb3wucov7j3esF2w2/MBaqdOsxY0QABKFNiq6S4FeAarmVlrbZm2X1qorjNgc2yem4Uq0XYvD1oTybxX0wFGx6wAqyzODEvqRDAQ6RVgsgJtU5/wBtGOVRR1RX4lGp5D1GaKDaQ2s1d4JgnMFN696rzKtBYpVsTTTPm4aoOgaHJ9Mo6olWmYr0kqncdoHGcd0n0mVikDOgiKLIWFo78dooME4SmvL7g8RsurFMA6EWiLi8EOACU7dUQVBzbGi/qVKUANl1oNpRWq9Yl4hq90r6jSkUGt0LPkQXcZptePz6iTkuCpi4g38SlkPxKO5g/wBiKEhGzY0PcESATvWgj3z/ANS9V2Sc3/wijOt1M3C5gXQ+r9QfqE2PBAXkBozAAVTxrGCAUKe0BCAVWtBkffuCfSI40zCVrq8S0gKiR1pAGVOgdZQ/ZOn7PWNaamOV4lwQiaMi11LUIIKQVvXKvfQ8RzNNHzELlMs1mAgvDYdAojQblKvm/wCxWAL3gBdSC/GhCGZkSILgnyuR3ySvpYEey/ceV1S4wfkjpXYcOrf19xCRjklxC9D+E2pi3nJQfFxnYW4rBliWLTP/2Q==';

    T.post('media/upload', { media_data: base64image }, function (err, data, response) {
        console.log(data);

        var mediaIdString = data.media_id_string;
        var meta_params = { media_id: mediaIdString }

        T.post('media/metadata/create', meta_params, function (err, data, response) {
            if (!err) {
                //this is where i'd put a caption on the image
                var params = { status: "\"WORK ETHIC - 19/05/2020\"", media_ids: mediaIdString }

                T.post('statuses/update', params, function (err, data, response) {
                    console.log(data);
                })
            }
        })
    })
    callback(null, 'some kind of status from json twitter response');
}

function main() {
    fetchFromTumblr('beans', function (err, resp) {
        if (!err) {
            console.log(resp);

            //convert resp from above into url below here (via regex or xpath)

            // request({ url: resp, encoding: 'binary' }, function (err, resp, body) {
            request({ url: resp }, function (err, resp, body) {

                var doc = new dom().parseFromString(body)
                var nodes = xpath.select('/html/head/meta[@property="og:image"]/@content', doc)
                var contentAttr = nodes[0].toString();
                var AttrSplit = contentAttr.split('\"');
                var url = AttrSplit[AttrSplit.length - 2];
                // console.log(url);

                request({ url: url, encoding: 'binary' }, function (err, resp, body) {
                    if (err) throw error;
    
                    // var imageType = imageResponse.headers['content-type'];
                    var base64image = new Buffer(body, 'binary').toString('base64');
    
                    postToTwitter(base64image, function (err, resp) {
                        console.log(resp);
                    });
                });
            });            
        }
    });
}

main();

//add error handling...
//convert synchronous file read to async
//remove warnings from console during runtime