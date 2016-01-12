const
  header = require('gulp-header'),
  pkg = require('package.json'),
  fs = require('fs');

module.exports = function(entry, name, dest) {

  gulp.src('dist/*.js')
    .pipe(header(fs.readFileSync('tasks/header.ejs', 'utf8'), {pkg: pkg}))
    .pipe(gulp.dest('dist/'))

}
