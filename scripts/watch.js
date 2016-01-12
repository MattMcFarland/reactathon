/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 * Neither the name Facebook nor the names of its contributors may be used to
 endorse or promote products derived from this software without specific
 prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import sane from 'sane';
import { resolve as resolvePath } from 'path';
import { spawn } from 'child_process';
import flowBinPath from 'flow-bin';
import figlet from 'figlet';

process.env.PATH += ':./node_modules/.bin';

var cmd = resolvePath(__dirname);
var srcDir = resolvePath(cmd, './src');



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

var flowServer = spawn(flowBinPath, ['server'], {
  cmd: cmd,
  env: process.env
});

var watcher = sane(srcDir, { glob: ['**/*.*'] })
  .on('ready', startWatch)
  .on('add', changeFile)
  .on('delete', deleteFile)
  .on('change', changeFile);

process.on('SIGINT', function () {
  watcher.close();
  flowServer.kill();
  console.log(CLEARLINE + yellow(invert('stopped watching')));
  process.exit();
});

var isChecking;
var needsCheck;
var toCheck = {};
var timeout;

function logTask(str) {
  console.log('\n', yellow('=========='), str, '\n');
}

function startWatch() {
  figlet('Fresh', function (err, data) {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    process.stdout.write(
      CLEARSCREEN + yellow(data) + '\n' +
      green(invert('watching...')
      )
    );

  });
}

function changeFile(filepath, root, stat) {
  if (!stat.isDirectory()) {
    toCheck[filepath] = true;
    debouncedCheck();
  }
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
      process.stdout.write(
        '\n' + (success ? '' : '\x07') + green(invert('watching...'))
      );
    });
}


function parseFiles(filepaths) {

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
  logTask('Running Tests');

  return exec('mocha', [
    '--reporter', 'nyan',
    '--require', 'tasks/mocha-bootload'
  ].concat(
    allTests(filepaths) ? filepaths.map(srcPath) : ['src/**/__tests__/**/*.js']
  )).catch(() => false);
}

function lintFiles(filepaths) {
  logTask('Linting Code');

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
  return exec(flowBinPath, ['status']).catch(() => false);
}

// Filepath

function srcPath(filepath) {
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

// Print helpers

var CLEARSCREEN = '\u001b[2J';
var CLEARLINE = '\r\x1B[K';
var CHECK = green('\u2713');
var X = red('\u2718');

function invert(str) {
  return `\u001b[7m ${str} \u001b[27m`;
}

function red(str) {
  return `\x1B[K\u001b[1m\u001b[31m${str}\u001b[39m\u001b[22m`;
}

function green(str) {
  return `\x1B[K\u001b[1m\u001b[32m${str}\u001b[39m\u001b[22m`;
}

function yellow(str) {
  return `\x1B[K\u001b[1m\u001b[33m${str}\u001b[39m\u001b[22m`;
}
