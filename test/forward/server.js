var net = require('net');
var ForkList = require("forklist");
var underscore = require('underscore');

var PORT = 6969;
var num = 5;
var module = 'worker';

var forklist = new ForkList({
    module: module,
    num: num,
    classifier: function classify(args, done) {
        done(null, underscore.random(0, num - 1));
    },
});

var server = net.createServer();

server.on('connection', function(sock) {

    forklist.foward('socket', sock);

    sock.on('error', function(e) {
        console.log('[server] Error:', e);
    });
});

server.listen(PORT);