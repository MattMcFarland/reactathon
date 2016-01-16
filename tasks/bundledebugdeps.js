var
  browserify = require('browserify'),
  gulp = require('gulp'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  uglify = require('gulp-uglify'),
  gutil = require('gulp-util'),
  sourcemaps = require('gulp-sourcemaps'),
  getNPMPackageIds = require('./helpers').getNPMPackageIds,
  nodeResolve = require('resolve');

module.exports = function(name, dest) {

  var b = browserify({debug: true});
  var filename = name + '.min.js';

  getNPMPackageIds().forEach(function (id) {
    b.require(nodeResolve.sync(id), { expose: id });
  });

  return b.bundle()
    .on('error', gutil.log)
    .pipe(source(filename))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .on('end', () => {
      gutil.log('File Saved', gutil.colors.cyan(dest + '/' + name + '.min.js'));
    })
    .pipe(gulp.dest(dest));
};

