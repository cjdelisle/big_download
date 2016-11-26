var Zlib = require('zlib');
var stream = Zlib.createGzip();
process.stdin.pipe(stream);

var child = function (data) {
    var writeData = function (stream) {
        var b = new Buffer(4096);
        var i = 0;
        var writtenSinceAck = 0;
        var writeMoar = function () {
            for (; i < data.length;) {
                var d = data[i];
                i++
                if (typeof(d) === 'string') {
                    var tb = new Buffer(d, 'hex');
                    writtenSinceAck += tb.length;
                    stream.write(tb);
                } else {
                    var bb = b.slice(0,d[1]);
                    bb.fill(d[0]);
                    writtenSinceAck += bb.length;
                    if (writtenSinceAck > 100000) {
                        stream.write(bb, function () { setTimeout(writeMoar); });
                        writtenSinceAck = 0;
                        return;
                    }
                    stream.write(bb);
                }
            }
        }
        writeMoar();
    };
    if (module.parent) {
        module.exports.writeData = writeData;
    } else {
        writeData(process.stdout);
    }
};

process.stdout.write('(' + child.toString() + ')([\n"');

var EMPTY_BUFF = new Buffer('');
var seqCount = 0;
var lastByte;
var remainder = EMPTY_BUFF;
stream.on('data', function (dat) {
    if (dat.length === 0) { return; }

    for (var i = 0; i < dat.length; i++) {
        if (dat[i] === lastByte) {
            seqCount++;
            continue;
        } else if (seqCount < 16) {
            process.stdout.write(remainder.toString('hex'));
            process.stdout.write(dat.slice(i - seqCount, i).toString('hex'));
        } else {
            process.stdout.write('",[' + lastByte + ',' + seqCount + '],\n"');
        }
        seqCount = 1;
        lastByte = dat[i];
        remainder = EMPTY_BUFF;
    }
    remainder = dat.slice(i - seqCount, i);
});

stream.on('end', function () {
    process.stdout.write(remainder.toString('hex'));
    process.stdout.write('"]);');
});
