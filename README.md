Fork List
======================

Easy to fork a list of child process
------------------------------------

Example:

    var ForkList = require('forklist');
    var underscore = require('underscore');

    // which script to run by multiprocess
    var path = './script/write';

    // child process num
    var num = 4;

    var forks = new ForkList({
        path: path,
        num: num,
        classifier: function classify(msg, done) {
            // random select a process to send
            var id = underscore.random(0, num - 1);
            done(null, id);
        }
    });

    for (var i = 0; i < times; i++) {
        forks.send('hello~', i);
    }

    forks.shutdown();

the `./script/write.js` is:

    var Forks = require('forklist');

    Forks.proc(function(data1, data2) {
        console.log('Work id:', this.workid, 'recv data1:', data1, 'data2:', data2);
    });

Output:

    Work id: 1 recv data1: hello~ data2: 1
    Work id: 2 recv data1: hello~ data2: 0
    Work id: 0 recv data1: hello~ data2: 5
    Work id: 1 recv data1: hello~ data2: 2
    Work id: 2 recv data1: hello~ data2: 3
    Work id: 1 recv data1: hello~ data2: 9
    Work id: 2 recv data1: hello~ data2: 4
    Work id: 0 recv data1: hello~ data2: 6
    Work id: 2 recv data1: hello~ data2: 7
    Work id: 2 recv data1: hello~ data2: 8


fork list method:

* send
* forward

Event:

* onExit
* onError
* onFinish