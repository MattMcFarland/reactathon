var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');


gulp.task('default', ['browser-sync']);

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

gulp.task('watch-client', ['nodemon'], () => {
  browserSync.init(null, {
    proxy: 'http://localhost:3000',
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

gulp.task('nodemon', function (cb) {

  var started = false;

  return nodemon({
    restartable: 'rs',
    verbose: false,
    exec: 'npm start',
    watch: [
    'src/**/*.js'
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
