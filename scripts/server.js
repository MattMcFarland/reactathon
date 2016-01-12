import sane from 'sane';
import { resolve as resolvePath } from 'path';
import { spawn } from 'child_process';
import figlet from 'figlet';
import {
  red, green, yellow, blue,
  magenta, cyan, white, gray
} from 'chalk';

process.env.PATH += ':./node_modules/.bin';

var cmd = resolvePath(__dirname);
var srcDir = cmd;

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
  console.log(CLEARLINE + yellow(invert('dev server killed')));
  watcher.close();
  server.kill();
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
      green(invert('Devserver online...')
      )
    );

  });
}


var isChecking;
var needsCheck;
var toCheck = {};
var timeout;


function changeFile(filepath, root, stat) {
  var time = new Date();


  if (filepath.indexOf('client') > -1) {

    exec('gulp', ['bundle']).then(() => {
     console.log(
        '\n' + blue(invert('Dev Server online...'))
      );
    });

  } else if (filepath.indexOf('server') > -1) {
    server.kill('SIGINT');

    exec('npm', ['run', 'test']).then(() => {
      exec('npm', ['run', 'build']).then(() => {
        setTimeout(function () {
          server = spawn('node', ['--harmony', 'lib/bin/server.js'], {
            cmd: cmd,
            env: process.env,
            stdio: 'inherit'
          });
          console.log(
            '\n' + blue(invert('Dev Server online...'))
          );
        }, 100)
      })
    }).catch((err => console.log(red(err, 'watching for changes...'))))



  }
}



var CLEARSCREEN = '\u001b[2J';
var CLEARLINE = '\r\x1B[K';
var CHECK = green('\u2713');
var X = red('\u2718');

function invert(str) {
  return `\u001b[7m ${str} \u001b[27m`;
}
