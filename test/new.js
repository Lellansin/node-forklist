var fs = require('fs');
var assert = require('assert');
var underscore = require('underscore');
var ForkList = require('../');

describe('ForkList', function() {

    var forks = new ForkList();

    forks.new('./script/write');
    forks.new('./script/write');

    var num = forks.count();

    forks.setClassifier(function(msg, done) {
        done(null, underscore.random(0, num - 1));
    });

    describe('.new', function() {

        it('should send 40 times', function(done) {
            var data_file = './data/new.js';
            var times = 40;

            // add two var to save count
            fs.writeFileSync(data_file, 'var work_0 = work_1 = 0;\n');

            // send data 40 times
            for (var i = 0; i < times; i++) {
                forks.send(data_file, i);
            }

            forks.on('finish', function() {

                // exports count
                fs.appendFileSync(data_file, 'exports.result = work_0 + work_1;');

                // get the total write count of 4 processes 
                var result = require(data_file).result;

                assert(times === result);
                done();
            });

            forks.shutdown();
        });
    });
});