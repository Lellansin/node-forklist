var ForkList = require('../');
var underscore = require('underscore');

var path = 'child';
var num = 2;
var fork = new ForkList({
    path: path,
    num: num,
    classifier: function classify(msg, done) {
        done(null, underscore.random(0, num - 1));
    }
});

for (var i = 0; i < 100; i++) {
    fork.send('"hello child"', i);
}

fork.close();