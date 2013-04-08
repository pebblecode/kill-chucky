
var sockjs = require('sockjs');

var yes = 0,
  no = 0;

exports.install = function(opts, server) {

  var broadcast = {};
  var sjs_broadcast = sockjs.createServer(opts);
  sjs_broadcast.on('connection', function(conn) {
    console.log('    [+] broadcast open ' + conn);
    broadcast[conn.id] = conn;
    var json = JSON.stringify({event: 'yes count', data: yes});
    for(var id in broadcast) {
      broadcast[id].write(json);
    }
    var json = JSON.stringify({event: 'no count', data: no});
    for(var id in broadcast) {
      broadcast[id].write(json);
    }
    conn.on('close', function() {
      delete broadcast[conn.id];
      console.log('    [-] broadcast close' + conn);
    });
    conn.on('data', function(m) {
      m = JSON.parse(m);
      if (m.event === "vote") {
        if (m.data === 'yes') {
          yes++;
          var json = JSON.stringify({event: 'yes count', data: yes});
          for(var id in broadcast) {
            broadcast[id].write(json);
          }
        }
        if (m.data === 'no') {
          no++;
          var json = JSON.stringify({event: 'no count', data: no});
          for(var id in broadcast) {
            broadcast[id].write(json);
          }
        }
      }
      for(var id in broadcast) {
        broadcast[id].write(JSON.stringify(m));
      }
    });
  });

  sjs_broadcast.installHandlers(server, {prefix:'/broadcast'});
};
