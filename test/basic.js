var ForkList = require('../');
var underscore = require('underscore');

var path = 'child';
var num = 4;
var forks = new ForkList({
    path: path,
    num: num,
    classifier: function classify(msg, done) {
        done(null, underscore.random(0, num - 1));
    }
});

for (var i = 0; i < 100; i++) {
    forks.send('"hello child"', i);
}

forks.shutdown();