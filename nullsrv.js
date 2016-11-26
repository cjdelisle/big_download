var Http = require('http');
var Infininulls = require('./Infininulls');

var handler = function (req, res) {
    console.log(req.connection.remoteAddress + '  ' + req.headers['user-agent']);
    res.writeHead(200, { 'content-encoding': 'gzip', 'Content-Type': 'application/octet-stream' });
    Infininulls.writeData(res);
}

if (module.parent) {
    module.exports.nulls = handler;
} else {
    Http.createServer(handler).listen(1337, '::');
    console.log("Listening on port 1337");
}
