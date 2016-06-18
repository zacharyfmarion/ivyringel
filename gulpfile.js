const gulp = require('gulp')
const sass = require('gulp-sass')
const server = require('gulp-server-livereload');

gulp.task('serve', () => {
  gulp.src('./')
      .pipe(server({
        livereload: true,
        directoryListing: true,
        open: true
      }))
})

gulp.task('sass', () => {
  gulp.src('./sass/**/*.scss')
      .pipe(sass())
      .pipe(gupl.dest('./css/'))
})

gulp.task('default', ['serve'], () => {
  gulp.watch('./sass/**/*.scss', ['sass'])
})
