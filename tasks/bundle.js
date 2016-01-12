const
  browserify = require('browserify'),
  gulp = require('gulp'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  getNPMPackageIds = require('./helpers').getNPMPackageIds,
  gutil = require('gulp-util');

/**
 *
 * @param entry
 * @param name
 * @param dest

 * @returns {*}
 */
module.exports = function(entry, name, dest, callback) {

  var b = browserify({
    entries: entry,
    debug: true
  });

  getNPMPackageIds().forEach(function (id) {
    b.external(id);
  });

  gutil.log('Creating bundle from', gutil.colors.cyan(entry + '.js'));
  b.on('log', gutil.log);
  return b.bundle()
    .on('nextTick', () => {
      gutil.log('Tick', gutil.colors.magenta(__filename));
    })
    .on('error', gutil.log)
    .pipe(source(name + '.js'))
    .pipe(buffer())
    .on('end', () => {
      gutil.log('File Saved', gutil.colors.cyan(dest + '/' + name + '.js'));
      if (callback) callback();
    })
    .pipe(gulp.dest(dest));
};
