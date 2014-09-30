var spawn = require('child_process').spawn;

var server = spawn('node', ['./sock_server'], { cwd: './forward' });
var client = spawn('node', ['./sock_client'], { cwd: './forward' });

server.stdout.on('data', function(data) {
    console.log('Server stdout: ' + data);
});

server.stderr.on('data', function(data) {
    console.log('stderr: ' + data);
});

server.on('close', function(code) {
    console.log('child process exited with code ' + code);
});

client.stdout.on('data', function(data) {
    console.log('Client stdout: ' + data);
});

client.stderr.on('data', function(data) {
    console.log('stderr: ' + data);
});

client.on('close', function(code) {
    console.log('child process exited with code ' + code);
});