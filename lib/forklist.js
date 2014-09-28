var child_process = require('child_process');

function ForkList(opts) {
  var self = this;
  var num = opts.num || 2;
  var path = opts.path;
  var classifier = opts.classifier;

  if (!path) {
    throw new Error('you must specialfy the child process file path');
  }

  self.list = [];
  self.classifier = classifier;

  for (var i = 0; i < num; i++) {
    self.new(path);
  }
}

module.exports = ForkList;

/*
 * New child process
 */
ForkList.prototype.new = function(path) {
  var self = this;
  var child = child_process.fork(path);

  child.on('exit', function() {
    console.log('pid:', this.pid, 'child exit');
  });

  child.on('close', function() {
    console.log('child close');
  });

  child.on('message', function() {
    console.log('child message');
  });

  self.list.push(child);
};

/*
 * Send message to child process
 */
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
    args.__type__ = 'normal';

    try {
      out.send(args);
    } catch (e) {
      console.log('e.message:', e.message);
    }
  });
};

/*
 * Foward special object (just for socket, server)
 */
ForkList.prototype.foward = function(type, obj) {
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
    out.send({
      __type__: type,
      __num__: num,
    }, obj);
  });
};

/*
 * End up all child process of the process list
 */
ForkList.prototype.shutdown = function() {
  var self = this;
  for (var i = self.list.length - 1; i >= 0; i--) {
    self.list[i].disconnect();
  }
};

/* 
 * Proc for child process
 */
ForkList.proc = function(cb) {
  process.on('message', function(msg, data) {
    if (msg.__type__ == 'socket') {
      debug('It\'s socket');
      cb(data);
      return;
    } else {
      debug('It\'s usual');
      cb.apply({
        workid: msg.__workdId__,
        error: msg.__err__,
      }, getArgsArr(msg));
    }
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
};

var debug = function() {};