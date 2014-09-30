var spawn = require('child_process').spawn;

var server = spawn('node', ['./forward/sock_server']);
// var client = spawn('node', ['./forward/sock_client']);

server.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
});

server.stderr.on('data', function(data) {
    console.log('stderr: ' + data);
});

server.on('close', function(code) {
    console.log('child process exited with code ' + code);
});

// client.stdout.on('data', function(data) {
//     console.log('stdout: ' + data);
// });

// client.stderr.on('data', function(data) {
//     console.log('stderr: ' + data);
// });

// client.on('close', function(code) {
//     console.log('child process exited with code ' + code);
// });