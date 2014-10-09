var forkList = require('../../');

forkList.proc(function(data1) {
    console.log('This is work:', this.workid, 'recv data1:', data1);
});