// =============================================================================
//     ___               __               __  __
//    / _ \___ ___ _____/ /________ _____/ /_/ /  ___  ___
//   / , _/ -_) _ `/ __/ __/___/ _ `/___/ __/ _ \/ _ \/ _ \
//  /_/|_|\__/\_,_/\__/\__/    \_,_/    \__/_//_/\___/_//_/
//
//  https://github.com/MattMcFarland/reactathon
// =============================================================================

/**
 * Import Dependencies
 */
import {
  app,
  http,
  https,
  fs,
  database,
  appConfig
} from './modules';

/**
 * Get server config, please see the root file: app.config.js
 */




const env = process.env.NODE_ENV || 'development';
const config = appConfig.server[env];

/**
 * Get port from configuration and store in Express.
 */
let port = normalizePort(config.port);
let sslPort = normalizePort(config.ssl.port);
app.set('port', port);
app.set('sslPort', sslPort);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);


/**
 * Create HTTPS server.
 */

const key = fs.readFileSync(config.ssl.key, 'utf8');
const cert = fs.readFileSync(config.ssl.cert, 'utf8');
const sslServer = https.createServer({key, cert}, app);



/**
 * Connect to database, then listen on provided port, on all network interfaces.
 */

console.time('\tdb connect');
var connections = 0;
database.connect().then(db => {
  console.time('\tserver connect');
  app.set('db', db);
  console.timeEnd('\tdb connect');

  addErrorListener(server, port);
  addErrorListener(sslServer, port);
  addStartListener(server);
  addStartListener(sslServer);

  server.listen(port);
  sslServer.listen(sslPort);


  /*
   var seedDatabase = require('../data/seed/exec');
   setTimeout(seedDatabase, 100);
   */
});



/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var _port = parseInt(val, 10);

  if (isNaN(_port)) {
    // named pipe
    return val;
  }

  if (_port >= 0) {
    // port number
    return _port;
  }

  return false;
}



function addErrorListener(_server, _port) {
  return _server.on('error', (error => {
    if (error.syscall !== 'listen') {

      throw error;
    }

    var bind = typeof _port === 'string'
      ? 'Pipe ' + _port
      : 'Port ' + _port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }));
}

function addStartListener(_server) {
  _server.on('listening', () => {
    var addr = _server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    console.log('\t=> Listening on ' + bind);
    connections++;
    if (connections === 2) {
      if (process && process.send) {
        process.send('ready');
      }
      console.timeEnd('\tserver connect');
    }
  });
}
