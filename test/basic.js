var fs = require('fs');
var Path = require('path');
var underscore = require('underscore');
var ForkList = require('../');

var path = 'child';
var num = 4;
var forks = new ForkList({
    path: path,
    num: num,
    classifier: function classify(msg, done) {
        done(null, underscore.random(0, num - 1));
    }
});

var filename = './data/basic.js';

fs.writeFileSync(filename, 'var work_1 = work_2 = work_3 = work_4 = 1;');

for (var i = 0; i < 100; i++) {
    forks.send(filename, i);
}

fs.appendFileSync(filename, 'exports.result = work_1 + work_2 + work_3 + work_4;');
var generator = require(filename);

console.log('result:', generator.result);

forks.shutdown();