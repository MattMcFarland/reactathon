import sane from 'sane';
import { resolve as resolvePath } from 'path';
import { spawn, fork } from 'child_process';
import flowBinPath from 'flow-bin';
import figlet from 'figlet';
import {
  red, green, yellow, blue,
  magenta, cyan, white, gray
} from 'chalk';

import browserSync from 'browser-sync';


process.env.PATH += ':./node_modules/.bin';

const cmd = resolvePath(__dirname);
const srcDir = cmd;

const appConfig = require(resolvePath(srcDir, 'lib/app.config'));

let {host, port} = appConfig.server.development;
let proxy = host + ':' + port;

var flowServer = spawn(flowBinPath, ['server'], {
  cmd: cmd,
  env: process.env
});
var bs = browserSync.create('Dev Server');

function exec(command, options) {
  return new Promise(function (resolve, reject) {
    var child = spawn(command, options, {
      cmd: cmd,
      env: process.env,
      stdio: 'inherit'
    });
    // Checking steps
    child.on('exit', function (code) {
      if (code === 0) {
        resolve(true);
      } else {
        reject(new Error('Error code: ' + code));
      }
    });
  });
}


var server = fork('lib/bin/server.js');

server.on('stdout', (m) => {
  console.log(blue(m));
})

/*
var server = spawn('node', ['--harmony', 'lib/bin/server.js'], {
  cmd: cmd,
  env: process.env,
  stdio: 'inherit'
});
*/
var watcher = sane(cmd, { glob: ['server/**/*.*', 'client/**/*.*'] })
  .on('ready', startWatch)
  .on('add', changeFile)
  .on('delete', deleteFile)
  .on('change', changeFile);

process.on('SIGINT', function () {
  console.log(CLEARLINE + yellow(invert('dev server killed')));
  bs.exit();
  flowServer.kill();
  server.kill();
  watcher.close();
  process.exit();
});

process.on('uncaughtException', (err) => {
  console.log(CLEARLINE + red(invert(`Caught exception: ${err}`)));
  bs.exit();
  flowServer.kill();
  server.kill();
  watcher.close();
});

function startWatch() {
  figlet('Reactathon', function (err, data) {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    process.stdout.write(
      CLEARSCREEN + yellow(data) + '\n' +
      green(invert('Watching...')
      )
    );
    bs.init({ proxy });
  });

}



var isChecking;
var needsCheck;
var toCheck = {};
var timeout;
var resetServer = false;
var shouldCopy = false;
var haltOperation = false;

function changeFile(filepath, root, stat) {

  if (!stat.isDirectory()) {
    toCheck[filepath] = true;
    debouncedCheck();
  }
}

// logging
function logTask(str) {
  console.log('\n', yellow('=========='), str, '\n');
}

function logError(msg) {
  haltOperation = true;
  bs.notify('<p style="padding: 1em; ' +
    'font-size: 14px; background:maroon; color: white;">' +
    'Server error encountered :(' +
    '</p>'
  );
  console.log(yellow('\nAn exception has been caught!\n'));
  console.log(red('\t', msg));
}

function logWaiting() {
  console.log('\n', green(invert('Waiting...')));
}

function deleteFile(filepath) {
  delete toCheck[filepath];
  debouncedCheck();
}

function debouncedCheck() {
  haltOperation = false;
  needsCheck = true;
  clearTimeout(timeout);
  timeout = setTimeout(guardedCheck, 250);
}

function guardedCheck() {
  if (isChecking || !needsCheck) {
    return;
  }
  isChecking = true;
  var filepaths = Object.keys(toCheck);
  toCheck = {};
  needsCheck = false;
  checkFiles(filepaths).then(() => {
    isChecking = false;
    process.nextTick(guardedCheck);
  });
}

function checkFiles(filepaths) {
  bs.notify('Changes detected! please wait...')
  console.log('\u001b[2J');
  return parseFiles(filepaths)
    .then(() => runTests(filepaths))
    .then(testSuccess => lintFiles(filepaths)
      .then(lintSuccess => typecheckStatus()
        .then(typecheckSuccess =>
        testSuccess && lintSuccess && typecheckSuccess)))
    .then(() => buildStyles(filepaths))
    .then(() => bundleClient(filepaths))
    .then(() => rebuildServer(filepaths))
    .then(() => copyFiles())
    .then(() => respawnServer())
    .then(() => syncBrowser())
    .then(() => logWaiting())
    .catch(err => logError(err));
}

function syncBrowser() {
  if (haltOperation) {
    return Promise.resolve('');
  }


  return new Promise(resolve => {
    setTimeout(function () {
      bs.reload();
      resolve();
    }, 10)
  });
}

function respawnServer() {
  if (haltOperation) {
    return Promise.resolve('');
  }
  if (resetServer) {
    logTask('Respawn Server');
    server.kill('SIGINT');
    return new Promise((resolve, reject) => {
      try {
        server = fork('lib/bin/server.js');
        server.on('stdout', (o => {
          console.log(blue(o));
        }));
        server.on('message', (m) => {
          console.log(cyan('\tserver:', m));
          if (m === 'ready') {
            resolve();
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

function copyFiles() {
  if (haltOperation) {
    return Promise.resolve('');
  }
  if (shouldCopy) {
    logTask('Copy files');
    shouldCopy = false;
    return Promise(exec('npm', ['run', 'copy']));
  }
}

function bundleClient(filepaths) {
  if (haltOperation) {
    filepaths = []
  }

  var rebundleClient = false;
  filepaths.forEach((filepath) => {
    if (isJS(filepath)
      && !isTest(filepath)
      && inClient(filepath)) {
      rebundleClient = true;
    }
  })
  if (rebundleClient) {
    logTask('Bundle Client files');
    return exec('gulp', ['bundle-dev']);
  }
}

function buildStyles(filepaths) {
  if (haltOperation) {
    filepaths = []
  }

  var rebuildStyles = false;
  filepaths.forEach((filepath) => {
    if (isScss(filepath)) {
      rebuildStyles = true;
    }
  })
  if (rebuildStyles) {
    logTask('Build SCSS files');
    return exec('gulp', ['sass']);
  }
}

function rebuildServer(filepaths) {
  if (haltOperation) {
    filepaths = []
  }

  filepaths.forEach((filepath) => {
    if (inServer(filepath)) {
      resetServer = true;
    }
  })
  if (resetServer) {
    logTask('Rebuild Server');
  }
  return Promise.all(filepaths.map(filepath => {
    if (inServer(filepath) &&
      isJS(filepath)
      && !isTest(filepath)) {
      //babel server/src --ignore __tests__ --out-dir lib

      return exec('babel', [
        filepath,
        '--out-file', filepath.replace(/server\/src/, 'lib'),
        srcPath(filepath)
      ]);
    }
  }));
}

function parseFiles(filepaths) {
  if (haltOperation) {
    filepaths = []
  }

  logTask('Checking Syntax');

  return Promise.all(filepaths.map(filepath => {
    if (isJS(filepath) && !isTest(filepath)) {
      return exec('babel', [
        '--optional', 'runtime',
        '--out-file', '/dev/null',
        srcPath(filepath)
      ]);
    }
  }));
}

function runTests(filepaths) {
  if (haltOperation) {
    filepaths = []
  }

  logTask('Running Tests');

  return exec('mocha', [
    '--reporter', 'nyan',
    '--require', 'scripts/mocha-bootload'
  ].concat(
    allTests(filepaths) ?
      filepaths.map(srcPath) :
      [
        'client/src/**/__tests__/**/*.js',
        'server/src/**/__tests__/**/*.js'
      ]
  )).catch(() => logError('Unit tests failed'))
}

function lintFiles(filepaths) {
  if (haltOperation) {
    filepaths = []
  }

  logTask('Linting Code');


  return filepaths.reduce((prev, filepath) => prev.then(prevSuccess => {
    process.stdout.write('  ' + filepath + ' ...');
    if (isScss(filepath)) {
      return;
    }
    return exec('eslint', [
      srcPath(filepath)])
      .catch(() => logError('Linting Code failed'))
      .then(success => {
        console.log(CLEARLINE + '  ' + (success ? CHECK : X) + ' ' + filepath);
        return prevSuccess && success;
      });
  }), Promise.resolve(true));
}



function typecheckStatus() {
  if (haltOperation) {
    return Promise.resolve();
  }
  logTask('Type Checking');

  return exec(flowBinPath, ['status'])
    .catch(() => logError('Type Checking failed'))
}

// Filepath

function srcPath(filepath) {

  return resolvePath(srcDir, filepath);
}

// Predicates

function isJS(filepath) {
  return filepath.indexOf('.js') === filepath.length - 3;
}

function isScss(filepath) {
  return filepath.indexOf('.scss') === filepath.length - 5;
}

function inClient(filepath) {
  return filepath.indexOf('client/src') >= 0;
}

function inServer(filepath) {
  return filepath.indexOf('server/src') >= 0;
}

function allTests(filepaths) {
  return filepaths.length > 0 && filepaths.every(isTest);
}

function isTest(filepath) {
  return isJS(filepath) && ~filepath.indexOf('__tests__/');
}

var CLEARSCREEN = '\u001b[2J';
var CLEARLINE = '\r\x1B[K';
var CHECK = green('\u2713');
var X = red('\u2718');

function invert(str) {
  return `\u001b[7m ${str} \u001b[27m`;
}
