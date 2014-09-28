var child_process = require('child_process');

function ForkList(opts) {
    var self = this;
    var num = opts.num || 2;
    var module = opts.module;
    var classifier = opts.classifier;

    if (!module) {
        throw new Error("you must specialfy the module");
    }

    self.list = [];
    self.classifier = classifier;

    for (var i = 0; i < num; i++) {
        var child = child_process.fork(module);
        
        child.on('exit', function() {
            console.log('pid:', this.pid ,'child exit');
        });

        child.on('close', function() {
            console.log('child close');
            console.log('arguments:', arguments);
        });

        child.on('message', function() {
            console.log('child message');
            console.log('arguments:', arguments);
        });
        self.list.push(child);
    }
}

module.exports = ForkList;

ForkList.prototype.send = function() {
    var self = this;
    var cb = function() {};
    var args = arguments;

    if (typeof args[args.length - 1] == 'function') {
        cb = args[args.length - 1];
    }

    self.classifier(args, function(err, num) {
        if (err) {
            return cb(err);
        }

        var out = self.list[num];
        args.__workdId__ = num;
        out.send(args);
    });
};

ForkList.prototype.close = function() {
    var self = this;
    for (var i = self.list.length - 1; i >= 0; i--) {
        self.list[i].disconnect();
    };
};

ForkList.proc = function(cb) {
    process.on('message', function(msg) {
        cb.apply({
            workid: msg.__workdId__,
            error: msg.__err__,
        }, getArgsArr(msg));
    });
};

var getArgsArr = function(msg) {
    var arr = [];
    var i = 0;

    while (msg[i] !== undefined) {
        arr.push(msg[i]);
        i++;
    }

    return arr;
}