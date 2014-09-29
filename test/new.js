var ForkList = require('../');
var underscore = require('underscore');

var forks = new ForkList();

forks.new('child');
forks.new('child');

var num = forks.count();

forks.setClassifier(function(msg, done) {
    done(null, underscore.random(0, num - 1));
});

for (var i = 0; i < 10; i++) {
    forks.send('"hello child"', i);
}

forks.shutdown();