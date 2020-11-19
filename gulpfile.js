var gulp = require('gulp');
var concat = require('gulp-concat');
gulp.task('compile', function() {
  return gulp.src(['./src/main.js','./src/util.js','./src/cmds.js','./src/entry.js'])
  .pipe(concat('extension.js'))
  .pipe(gulp.dest('./'))
});