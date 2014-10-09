var assert = require('assert');
var ForkList = require('../');



describe('ForkList', function() {

    describe('.kill', function() {

        it('should trigger onError event', function(done) {

            var path = './script/read';
            var num = 4;

            var forks = new ForkList({
                path: path,
                num: num
            });

            forks.on('error', function(err, pid) {
                done();
            });

            forks.kill(0);
            forks.send('hello');

            forks.shutdown();
            
        });

        it('should invoke callback', function(done) {

            var path = './script/read';
            var num = 4;

            var forks = new ForkList({
                path: path,
                num: num
            });

            forks.kill(0);

            var callback = function(err, pid) {
                done();
            };

            forks.send('hello', callback);

            forks.shutdown();

        });
    });
});