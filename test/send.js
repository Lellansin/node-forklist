var fs = require('fs');
var Path = require('path');
var assert = require('assert');
var ForkList = require('../');

describe('ForkList', function() {

    // which script to run by multiprocess
    var path = './script/write';

    // child process num
    var num = 5;

    var forks = new ForkList({
        path: path,
        num: num
    });

    describe('.send', function() {
        
        it('should send 9999 times', function(done) {
            var data_file = './data/basic.js';
            var times = 9999;

            // add four var to save count
            fs.writeFileSync(data_file, 'var work_0 = work_1 = work_2 = work_3 = work_4 = 0;\n');

            // send data 9999 times
            for (var i = 0; i < times; i++) {
                forks.send(data_file, i);
            }

            forks.on('finish', function() {

                // exports count
                fs.appendFileSync(data_file, 'exports.result = work_0 + work_1 + work_2 + work_3 + work_4;');

                // get the total write count of 4 processes 
                var result = require(data_file).result;

                console.log('times:', times);
                console.log('result:', result);
                assert(times === result);
                done();
            });

            // forks.shutdown();
        });
    });
});