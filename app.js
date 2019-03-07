var express = require("express");
var request = require("request");
var cors = require("cors");
var FeedParser = require("feedparser");

var app = express();
app.use(cors());
module.exports.app = app;
app.set("port", process.env.PORT || 5000);
app.get("/", function(incoming_request, response) {
  var url = incoming_request.query.url;
  if (url === undefined){
    response.send(`Usage: ${incoming_request.headers.host}/?url=feedURL`);
    return;
  }
  if (!url.match("^(http|https|ftp)://.*$")) {
    var protocol = "http://";
    if (url.indexOf("//") == 0) protocol = "http:";
    url = protocol + url;
  }


  var req = request(url);
  var feedparser = new FeedParser();

  var collection = [];
  var limitReached = false;

  req.on("error", function(error) {
    console.error(error);
    response.send('Could not get the requested URL.');
  });

  req.on("response", function(res) {
    var stream = this; // `this` is `req`, which is a stream

    if (res.statusCode !== 200) {
      this.emit("error", new Error("Bad status code"));
    } else {
      stream.pipe(feedparser);
    }
  });
  feedparser.on("error", function(error) {
    console.error(error);
  });

  feedparser.on("readable", function() {
    var stream = this; // `this` is `feedparser`, which is a stream
    var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
    var item;
    
    //Add articles to collection
    while ((item = stream.read()) && !limitReached) {
      if(collection.length >= 10){
        limitReached = true;
        break;
      }
      collection.push(item); //array of objects
    }
  });

  feedparser.on("end", function() {
    var stream = this;
    var meta = this.meta;
    var finalResponse = {};
    finalResponse.entries = collection;
    finalResponse.meta = meta;
    response.send(finalResponse);
  });
});

app.listen(app.get("port"), function() {
  console.log("Feed to Json is running on port", app.get("port"));
});
