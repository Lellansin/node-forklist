var fs = require('fs');
var Path = require('path');
var assert = require('assert');
var ForkList = require('../');

// which script to run by multiprocess
var path = './script/basic';

var times = 100;

describe('ForkList', function() {

    describe('.send', function() {
        var forks = new ForkList({
            path: path
        });

        it('Number and String', function(done) {

            for (var i = 0; i < times; i++) {
                forks.send(i, 'hello world');
            }

            forks.on('finish', function() {
                done();
            });

            forks.shutdown();
        });
    });

    describe('.send', function() {
        var forks = new ForkList({
            path: path
        });

        it('Number and String', function(done) {

            for (var i = 0; i < times; i++) {
                forks.send(i, 'hello world');
            }

            forks.on('finish', function() {
                done();
            });

            forks.shutdown();
        });
    });

    describe('.send', function() {
        var forks = new ForkList({
            path: path
        });

        it('Array data', function(done) {

            for (var i = 0; i < times; i++) {
                forks.send(i, [i, i + 1]);
            }

            forks.on('finish', function() {
                done();
            });

            forks.shutdown();
        });
    });

    describe('.send', function() {
        var forks = new ForkList({
            path: path
        });

        it('JSON data', function(done) {

            for (var i = 0; i < times; i++) {
                forks.send(i, {
                    num: i
                });
            }

            forks.on('finish', function() {
                done();
            });

            forks.shutdown();
        });
    });

    describe('.send', function() {
        it('Function data but wouldn\'t work', function(done) {
            var forks = new ForkList({
                path: path
            });

            function hi(str) {
                console.log(str);
            }

            for (var i = 0; i < times; i++) {
                // the function can be sent but wouldn't work in child process
                forks.send(i, hi);
            }

            forks.on('finish', function() {
                done();
            });

            forks.shutdown();
        });
    });

    describe('.send', function() {
        it('can send part of Object data', function(done) {
            var forks = new ForkList({
                path: path
            });

            function test(name) {
                this.name = name || 'default';
            }

            test.prototype.hi = function() {
                console.log('my name is ', this.name);
            };

            for (var i = 0; i < times; i++) {
                var t = new test('Alan' + i);
                // you can only get { name: 'AlanX' }, the prototype will lost
                forks.send(i, t);
            }

            forks.on('finish', function() {
                done();
            });

            forks.shutdown();
        });
    });
});