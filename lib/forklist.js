var util = require('util');
var events = require("events");
var underscore = require("underscore");
var child_process = require('child_process');

function ForkList(opts) {
  this.init(opts || {});
}

util.inherits(ForkList, events.EventEmitter);

/*
 * Init
 */
ForkList.prototype.init = function(opts) {
  var self = this;

  self.jobs = 0;
  self.list = [];
  self.online = 0;
  self.setLogger(opts.log);
  self.setClassifier(opts.classifier);

  if (!opts || !opts.path) {
    return;
  }

  var num = opts.num || 2;
  var path = opts.path;

  for (var i = 0; i < num; i++) {
    self.new(path);
  }
};

/*
 * New child process
 */
ForkList.prototype.new = function(path) {
  var self = this;
  var child = child_process.fork(path);

  child.on('exit', self.exit.bind(self, child.pid));

  // todo add callback by this event
  child.on('message', function() {
    self.log.info('child message:', arguments);
  });

  child.on('error', function(err) {
    self.emit('error', err, child.pid)
  });

  self.list.push(child);
  self.online += 1;
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
    args.__master_pid__ = process.pid;

    try {
      out.send(args);
      self.inc();
    } catch (e) {
      console.log('e.message:', e.message);
    }
  });
};

/*
 * Foward Handle object (just for socket, server)
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
      __master_pid__: process.pid
    }, obj);
    self.inc();
  });
};

/*
 * Set transport classifier
 */
ForkList.prototype.setClassifier = function(classifier) {
  var self = this;
  if (!!classifier && classifier.constructor == Function) {
    self.classifier = classifier;
  } else {
    self.classifier = function(msg, done) {
      var id = underscore.random(0, self.list.length - 1);
      done(null, id);
    }
  }
};

/*
 * Set mater logger
 */
ForkList.prototype.setLogger = function(log) {
  if (!!log && log.constructor == Function) {
    this.log = log;
  } else if (log === true) {
    this.log = {
      info: console.log,
      error: console.error
    };
  } else {
    var empty = function() {};
    this.log = {
      info: empty,
      error: empty
    };
  }
};

/*
 * Get the child process number
 */
ForkList.prototype.count = function() {
  return this.list.length;
};

/*
 * Increase the jobs
 */
ForkList.prototype.inc = function() {
  this.jobs++;
};

/*
 * Get the child process number
 */
ForkList.prototype.exit = function(pid) {
  this.online -= 1;
  this.emit('exit', pid);

  if (this.online === 0) {
    this.emit("finish");
  }
};

/*
 * Forcely end up all child process of the process list
 */
ForkList.prototype.shutdown = function() {
  var self = this;
  for (var i = self.list.length - 1; i >= 0; i--) {
    self.list[i].disconnect();
  }
};

/*
 * Forcely end up all child process of the process list
 */
ForkList.prototype.killByPid = function(pid) {
  var self = this;
  for (var i = self.list.length - 1; i >= 0; i--) {
    var child = self.list[i];
    if (child.pid == pid) {
      child.disconnect();
    }
  }
};

/* 
 * Proc for child process
 */
ForkList.proc = function(cb) {
  process.on('message', function(msg, data) {
    // todo there's server
    if (msg.__type__ == 'socket') {
      debug('It\'s socket');
      cb(data);
      return;
    } else {
      debug('It\'s usual');
      cb.apply({
        workid: msg.__workdId__,
        error: msg.__err__,
      }, getArgsArr(msg, done.bind({
        pid: msg.__master_pid__
      })));
    }
  });
};

var done = function(err) {

};

var getArgsArr = function(msg, cb) {
  var arr = [];
  var i = 0;

  while (msg[i] !== undefined) {
    arr.push(msg[i]);
    i++;
  }

  if (!!cb) {
    arr.push(cb);
  }

  return arr;
};

var debug = function() {};

module.exports = ForkList;