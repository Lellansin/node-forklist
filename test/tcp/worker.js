var forkList = require('forklist');

console.log('worker started pid' + process.pid);

forkList.proc(function(err, data) {
    console.log('[worker] This is work:', this.workid, 'arguments:', arguments);
});