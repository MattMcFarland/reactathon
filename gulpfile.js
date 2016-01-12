/* Module Dependencies */
const gulp = require('gulp');
const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');

/* Task Dependencies */
const bundle = require('./tasks/bundle');
const bundlemin = require('./tasks/bundlemin');
const bundledeps = require('./tasks/bundledeps');
const sass = require('./tasks/sass');

gulp.task('default', ['browser-sync']);


/**
 * Task Definitions
 */

gulp.task('watch-server', () => {
  return nodemon({
    restartable: 'rs',
    verbose: false,
    exec: 'npm test && npm run build && npm run debug',
    watch: [
      'server/src/**/*.js',
      'server/views/**/*.hbs'
    ],
    env: {
      NODE_ENV: 'development'
    },
    ext: 'js json'
  });
});

gulp.task('watch-lib', ['nodemon'], () => {
  browserSync.init(null, {
    proxy: 'http://localhost:3030',
    reloadDelay: 50,
    reloadDebounced: 50,
    online: false,
    files: [
      'lib/public/**/*'
    ],
    browser: 'google chrome',
    port: 7000
  });
});

gulp.task('watch-client', function (cb) {

  var started = false;

  return nodemon({
    restartable: 'rs',
    verbose: false,
    exec: 'gulp bundle',
    watch: [
    'client/src/**/*.js'
  ],
    env: {
    NODE_ENV: 'development'
  },
    ext: 'js json'
  }).on('start', () => {
    if (!started) {
      cb();
      started = true;
    }
  });
});


gulp.task('nodemon', function (cb) {

  var started = false;

  return nodemon({
    restartable: 'rs',
    verbose: false,
    env: {
      NODE_ENV: 'development'
    },
    ext: 'js json'
  }).on('start', () => {
    if (!started) {
      cb();
      started = true;
    }
  });
});






gulp.task('bundle-vendor', (done) =>
  bundledeps('vendor', 'bundles/js/vendor', done)
);
gulp.task('bundle', () =>
  bundlemin('client/src/main', 'main', 'bundles/js')
);
gulp.task('bundle-dev', () =>
  bundle('client/src/main', 'main.min', 'bundles/js')
);
gulp.task('sass', () =>
  sass('client/src/style/main.scss', 'main', 'bundles/style')
);

gulp.task('build', ['bundle-vendor', 'bundle', 'sass']);
gulp.task('dev', ['bundle-dev', 'sass']);
