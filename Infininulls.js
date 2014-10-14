(function (data) {
    var writeData = function (stream) {
        var b = new Buffer(4096);
        var i = 0;
        var writtenSinceAck = 0;
        var writeMoar = function () {
            for (; i < data.length; i++) {
                var d = data[i];
                if (i === 11) { i = 3; }
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
})([
"1f8b0800000000000003ecc101010000008090feafee080a",[0,4094],
"80d98303010000000020ffd74650",[85,4095],
"610f0e040000000080fc5f1b41",[85,4095],
"853d38100000000000f27f6d04",[85,4095],
"15f6e0400000000000c8ffb51154",[85,4095],
"d88303010000000020ffd74650",[85,4095],
]);
