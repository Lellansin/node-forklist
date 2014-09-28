var forkList = require('../');

console.log('child started with pid', process.pid);

forkList.proc(function(data1, data2) {
    console.log('This is work:', this.workid, 'recv data1:', data1, 'data2:', data2);
});