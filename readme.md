# Big Download - It must be close to finished by now...

Endless gzip generator.... Because nulls compress really well.

This project contains 2 components:

1. supergzip.js which represents gzipped repeating data in a more compact form
1. Infininulls.js which sends the equivilant of endless `\0\0\0\0\0` in gzipped form
1. BigDownload.js which takes a nodejs http request/response, tells the browser/spider that it's a
gzip compessed octet stream and then sends endless nulls.
2. nullsrv.js for the lazy who can't be bothered to write a nodejs http server.


supergzip is only useful for detecting patterns in gzipped results of really really
simple content, like /dev/zero. How infininulls was made:

   cat /dev/zero | node ./supergzip.js

Notice a repeating pattern...

Add the line: `if (i === 11) { i = 3; }` to the output and truncate on line number 12.
