# Big Download - Node express middleware for zipbombing vuln scanners

This thing makes a server which will send someone a file of infinite size until it fills up their
harddrive or memory but it uses gzip compression to do so really really fast!

Thanks to Christian Haschek for writing a [blog post](https://blog.haschek.at/post/f2fda) about
this which encouraged my to clean up this repo a little bit.

## Use with express.js

```javascript
var Express = require('express');
var BigDownload = require('big_download');
var app = Express();
[
    '/wp-login.php'
    /^wp-admin/,
    /^wp-content/,
    '/jmx-console'
    '/SQLiteManager/main.php'
    '/sqlitemanager/main.php'
    '/SQLiteManager-1.2.4/main.php'
    '/phpMyAdmin-4.2.1-all-languages'
    '/phpMyAdmin-4.2.1-english'
    '/phpMyAdmin'
    '/phpmyadmin'
    '/MySQLDumper'
    '/mysqldumper'
    '/myadmin'
    '/jenkins/script'
    '/sqlite/main.php'
    '/wp-login.php2'
].forEach((url) => {
    app.get(url, BigDownload.nulls);
})
```

## What happens when someone hits this "service"...

1. They get a gzip encoding header (most things support this)
2. They start getting valid gzip data which is gzip representation of all null bytes
so it decompresses 1000x it's size.
3. It Never Stops.


## How the shit works internally.

This project contains 2 components:

1. supergzip.js which represents gzipped repeating data in a more compact form
1. Infininulls.js which sends the equivilant of endless `\0\0\0\0\0` in gzipped form
1. BigDownload.js which takes a nodejs http request/response, tells the browser/spider that it's a
gzip compessed octet stream and then sends endless nulls.
2. nullsrv.js for the lazy who can't be bothered to write a nodejs http server.


Fun fact: The compression ratio of `/dev/zero` is approximately 1000:1 so you can do more with less.


supergzip is only useful for detecting patterns in gzipped results of really really
simple content, like /dev/zero. How infininulls was made:

`cat /dev/zero | node ./supergzip.js`

Notice a repeating pattern...

Add the line: `if (i === 11) { i = 3; }` to the output and truncate on line number 12.


## License

MIT so you can use it in all of your Enterprise Software Projects.
