var
  browserify = require('browserify'),
  gulp = require('gulp'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  uglify = require('gulp-uglify'),
  gutil = require('gulp-util'),
  sourcemaps = require('gulp-sourcemaps'),
  getNPMPackageIds = require('./helpers').getNPMPackageIds,
  compressionOptions = require('../config/gulpCompressionOptions');

module.exports = function(entry, name, dest, callback) {
  var b = browserify({
    entries: entry,
    debug: false
  });
  var filename = name + ".min.js";

  getNPMPackageIds().forEach(function (id) {
    b.external(id);
  });

  return b.bundle()
    .on('error', gutil.log)
    .pipe(source(filename))
    .pipe(buffer())
    // .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify(compressionOptions))
    // .pipe(sourcemaps.write('./'))
    .on('end', () => {
      gutil.log('File Saved', gutil.colors.cyan(dest + '/' + name + '.min.js'));
    })
    .pipe(gulp.dest(dest));
};

