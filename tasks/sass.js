var
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  gutil = require('gulp-util');

module.exports = function(entry, name, dest) {
  return gulp.src(entry)
    .pipe(sass())
    .on('error', gutil.log)
    .on('end', () => {
      gutil.log('File Saved', gutil.colors.cyan(dest + '/' + name + '.css'));
    })
    .pipe(gulp.dest(dest));
}

