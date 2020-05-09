'use strict';

function fetchFromTumblr() {
    const fs = require('fs');
    var tumblr = require('tumblr.js');
    
    let data = fs.readFileSync('../authentication.json');
    let tumblrDetails = JSON.parse(data);

    var client = tumblr.createClient(tumblrDetails.authentication.tumblr);

    client.blogPosts('pradaindustries', { limit: 1 }, function (err, resp) {
        var postURL = resp.posts[0].short_url;
        // console.log(postURL);
        postToTwitter(postURL)
    });
}

function postToTwitter(postURL) {
    console.log(postURL);
    console.log(tumblrDetails.authentication.twitter)
}

fetchFromTumblr();