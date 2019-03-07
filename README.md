# Feed To JSON Parser

Convert an RSS/Atom feed into an object containing all entries and metadata for the feed using node.js and the FeedParser Library. While This acts similarly to the now-deprecated Google Feeds API, it functions slightly differently. If you need a drop in replacement for that, please see the feednami project, which functions very similarly to mmt-rss-reader, but has an option for google feed api formatting.

This can function as a free alternative to feednami (the returned object is identical to that of the non-google feednami return). If you choose to utilize this tool, you may test using the below request url, **but please use your own hosting for production use.**

This is based loosely on the rss2js project found here: https://github.com/mapsam/rss2js and the feednami project found here: https://toolkit.sekando.com/docs/en/feednami

## Usage

Just make an HTTP GET request to applicationurl:5000?url=https://Your.URL.HERE.com
