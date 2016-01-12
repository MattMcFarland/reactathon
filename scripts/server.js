import sane from 'sane';
import { resolve as resolvePath } from 'path';
import { spawn } from 'child_process';
import flowBinPath from 'flow-bin';
import figlet from 'figlet';
import {
  red, green, yellow, blue,
  magenta, cyan, white, gray
} from 'chalk';

import browserSync from 'browser-sync';

process.env.PATH += ':./node_modules/.bin';

var cmd = resolvePath(__dirname);
var srcDir = cmd;

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

var server = spawn('node', ['--harmony', 'lib/bin/server.js'], {
  cmd: cmd,
  env: process.env,
  stdio: 'inherit'
});

var watcher = sane(cmd, { glob: ['server/**/*.*', 'client/**/*.*'] })
  .on('ready', startWatch)
  .on('add', changeFile)
  .on('change', changeFile);

process.on('SIGINT', function () {
  bs.exit();
  flowServer.kill();
  server.kill();
  console.log(CLEARLINE + yellow(invert('dev server killed')));
  watcher.close();
  process.exit();
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
      green(invert('Devserver online...\n')
      )
    );

    bs.init({
      proxy: 'http://localhost:3030'
    });

  });
}



var isChecking;
var needsCheck;
var toCheck = {};
var timeout;


function changeFile(filepath, root, stat) {
  bs.notify('file changed', filepath);
  if (!stat.isDirectory()) {
    toCheck[filepath] = true;
    debouncedCheck();
  }
}

function logTask(str) {
  console.log('\n', yellow('=========='), str, '\n');
}


function deleteFile(filepath) {
  delete toCheck[filepath];
  debouncedCheck();
}

function debouncedCheck() {
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
  console.log('\u001b[2J');
  return parseFiles(filepaths)
    .then(() => runTests(filepaths))
    .then(testSuccess => lintFiles(filepaths)
      .then(lintSuccess => typecheckStatus()
        .then(typecheckSuccess =>
        testSuccess && lintSuccess && typecheckSuccess)))
    .catch(() => false)
    .then(success => {
      if (!success) {
        bs.notify('server failed to rebuild...');
      }
      var filepath = filepaths[0];
      if (filepath.indexOf('client') > -1) {

        exec('gulp', ['bundle']).then(() => {
          console.log(
            '\n' + cyan(CLEARSCREEN, CLEARLINE, invert('Dev Server online...'))
          );
          setTimeout(bs.reload(), 50);
        });

      } else if (filepath.indexOf('server') > -1) {
        server.kill('SIGINT');
        bs.exit();
        exec('npm', ['run', 'test']).then(() => {
          exec('npm', ['run', 'build']).then(() => {
            setTimeout(function () {
              server = spawn('node', ['--harmony', 'lib/bin/server.js'], {
                cmd: cmd,
                env: process.env,
                stdio: 'inherit'
              });
              console.log(
                '\n' + cyan(CLEARSCREEN, CLEARLINE, invert('Dev Server online...'))
              );
              setTimeout(function () {
                bs.init({
                  proxy: 'http://localhost:3030'
                });
              }, 2000)

            }, 100)
          })
        }).catch((err => console.log(red(err, 'watching for changes...'))))
      }
    });
}


function parseFiles(filepaths) {

  logTask('Checking Syntax');
  bs.notify('rebuild: checking syntax');
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
  logTask('Running Tests');
  bs.notify('rebuild: running tests');

  return exec('mocha', [
    '--reporter', 'nyan',
    '--require', 'scripts/mocha-bootload'
  ].concat(
    allTests(filepaths) ? filepaths.map(srcPath) : ['server/src/**/__tests__/**/*.js']
  )).catch(() => false);
}

function lintFiles(filepaths) {
  logTask('Linting Code');
  bs.notify('rebuild: linting code');

  return filepaths.reduce((prev, filepath) => prev.then(prevSuccess => {
    process.stdout.write('  ' + filepath + ' ...');
    return exec('eslint', [
      srcPath(filepath)])
      .catch(() => false)
      .then(success => {
        console.log(CLEARLINE + '  ' + (success ? CHECK : X) + ' ' + filepath);
        return prevSuccess && success;
      });
  }), Promise.resolve(true));
}



function typecheckStatus() {
  logTask('Type Checking');
  bs.notify('rebuild: type checking...');
  return exec(flowBinPath, ['status']).catch(() => false);
}

// Filepath

function srcPath(filepath) {
  bs.notify('file changed', filepath);
  return resolvePath(srcDir, filepath);
}

// Predicates

function isJS(filepath) {
  return filepath.indexOf('.js') === filepath.length - 3;
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
