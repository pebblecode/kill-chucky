var http = require('http');
var config = require('./config').config;
var sockjs_app = require('./sockjs_app');
var node_static = require('node-static');

var static_directory = new node_static.Server(__dirname);

var server = http.createServer();
server.addListener('request', function(req, res) {
      static_directory.serve(req, res);
});
server.addListener('upgrade', function(req, res){
  res.end();
});

sockjs_app.install(config.server_opts, server);

console.log(" [*] Listening on", config.host + ':' + config.port);
server.listen(config.port, config.host);
