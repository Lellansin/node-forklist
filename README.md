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
    var num = 3;

    var forks = new ForkList({
        path: path,
        num: num,
        classifier: function classify(msg, done) {
            // random select a process to send
            var id = underscore.random(0, num - 1);
            done(null, id);
        }
    });

    for (var i = 0; i < 10; i++) {
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

Manual
=====================

Init
------------------------------------

* `new`
* `count`
* `setClassifier`
* `setLogger`

Example

    var ForkList = require('forklist');
    var underscore = require('underscore');
    
    var times = 10;
    var forks = new ForkList();
    
    forks.new('./script');
    forks.new('./script');
    
    forks.setClassifier(function(msg, done) {
        var id = underscore.random(0, forks.count() - 1);
        done(null, id);
    });
    
    for (var i = 0; i < times; i++) {
        forks.send(i, 'some msg');
    }
    
    forks.shutdown();

set logger



Transfor
------------------------------------

* `send`
* `forward`

Control
------------------------------------

* `shutdown`
* `killByPid`

Event
------------------------------------

* `onExit`
* `onError`
* `onFinish`

Example:

    var ForkList = require('forklist');
    var underscore = require('underscore');
    
    var path = './script';
    var num = 3;
    
    var forks = new ForkList({
        path: path,
        num: num,
        classifier: function classify(msg, done) {
            done(null, underscore.random(0, num - 1));
        },
        log: true
    });
    
    for (var i = 10; i >= 0; i--) {
        forks.send('hello ' + i);
    };
    
    forks.on('error', function(err, pid) {
        console.log('--> Error:', err.message, 'pid:', pid);
    });
    
    forks.on('exit', function(pid) {
        console.log('--> Child process exit, pid:', pid);
        forks.killByPid(pid);
    });
    
    forks.on('finish', function() {
        console.log('--> All of child process has exited');
    });
    
    forks.shutdown();

script.js
    
    var Forks = require('forklist');

    Forks.proc(function(data1, data2) {
        console.log('Work id:', this.workid, 'recv data1:', data1);
    });

Output:

    Work id: 0 recv data1: hello 10
    Work id: 0 recv data1: hello 8
    Work id: 0 recv data1: hello 7
    Work id: 2 recv data1: hello 9
    Work id: 0 recv data1: hello 6
    Work id: 1 recv data1: hello 5
    Work id: 0 recv data1: hello 2
    Work id: 0 recv data1: hello 0
    Work id: 1 recv data1: hello 4
    Work id: 1 recv data1: hello 3
    Work id: 1 recv data1: hello 1
    --> Child process exit, pid: 15064
    --> Error: IPC channel is already disconnected pid: 15064
    --> Child process exit, pid: 13072
    --> Error: IPC channel is already disconnected pid: 13072
    --> Child process exit, pid: 4900
    --> Error: IPC channel is already disconnected pid: 4900
    --> All of child process has exited