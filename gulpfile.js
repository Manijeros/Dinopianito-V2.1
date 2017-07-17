// QUICK GULPFILE

const gulp = require('gulp');
const babel = require('gulp-babel');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');
const eslint = require('gulp-eslint');
const notify = require('gulp-notify')

// Pug task

gulp.task('pug', function buildHTML() {
  return gulp.src('app/pug/index.pug')
  .pipe(notify('Pug updated!'))
  .pipe(pug({
    // Your options in here.
  }))
  .pipe(gulp.dest('public'))
});

// Stylus task

gulp.task('stylus', function () {
  return gulp.src('app/stylus/main.styl')
    .pipe(notify("Stylus updated!"))
    .pipe(stylus())
    .pipe(gulp.dest('public'));
});

// JS lint and formatting

gulp.task('babel', function() {
// Node source
        gulp.src(["app/js/**/*.js"])
          .pipe(eslint())
          .pipe(eslint.format());
        gulp.src("app/js/**/*.js")
          .pipe(notify('JS Updated!'))
          .pipe(babel())
          .pipe(gulp.dest("public"));
});

// WATCH - STYLUS, PUG,

gulp.task('default', ['pug','stylus','babel'], function(){
  gulp.watch('app/stylus/**/*.styl',['stylus']);
  gulp.watch('app/pug/**/*.pug',['pug']);
  gulp.watch('app/js/**/*.js',['babel']);
})
