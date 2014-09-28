var ForkList = require('../');
var underscore = require('underscore');

var num = 2;
var module = 'child';
var fork = new ForkList({
    num: num,
    module: module,
    classifier: function classify(e, done) {
        return done(null, underscore.random(0, num - 1));
    }
});

for (var i = 0; i < 10; i++) {
    fork.send('"hello child"', i);
}

fork.close();