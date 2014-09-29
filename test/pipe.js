var fs = require('fs');
var Path = require('path');
var assert = require('assert');
var ForkList = require('../');


// which script to run by multiprocess
var path = './script/read';

// child process num
var num = 5;

var forks = new ForkList({
    path: path,
    num: num
});


var data_file = './data/basic.js';
var times = 10;

// send data 100 times
for (var i = 0; i < times; i++) {
    forks.write(i);
}

forks.on('finish', function() {
    console.log('--> finish')
});

// 
forks.shutdown();