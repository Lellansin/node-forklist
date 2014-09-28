var ForkList = require('../');
var underscore = require('underscore');

var module = 'child';
var num = 2;
var fork = new ForkList({
    module: module,
    num: num,
    classifier: function classify(msg, done) {
        done(null, underscore.random(0, num - 1));
    }
});

for (var i = 0; i < 10; i++) {
    fork.send('"hello child"', i);
}

fork.close();