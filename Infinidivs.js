// This server sends <!DOCTYPE html><body><div><div><div><div><div><div>.....forever
// Not so interesting anymore because modern browsers don't parse html until they've
// received all of it.
(function (data) {
    var writeData = function (stream) {
        var b = new Buffer(8192);
        var i = 0;
        var writtenSinceAck = 0;
        var writeMoar = function () {
            for (; i < data.length;) {
                var d = data[i];
                if (i === 17) { i = 1; }
                //console.error(i + '  ' + data.length + '  ' + data[i]);
                i++;
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
"1f8b0800000000000003ecc5b10980301000c055de3d9e346aad451a5b49a160b011c1ed5de4aeb9" +
"1ca665acdb3ac7f1f4abe47eb7af4444b6f3b56" + new Array(2043).join('ddbb66') +
"ddbb6fdb31787040000000040febf7684e2",[255,6143],
"632f0e090000000080fc7fed08c5",[255,6143],
"c75e1c120000000000f9ffda118a",[255,6143],
"8fbd38240000000000f2ffb52314",[255,6143],
"1f7b71480000000000e4ff6b4728fe",[255,6142],
"3ff6e2900000000000c8ffd78e50fc",[255,6142],
"7fecc521010000000090ffaf1da1f8",[255,6143],
"d88b43020000000020ff5f3b42f1",[255,6143],
"b11787040000000040febf7684e2",[255,6143],
]);
