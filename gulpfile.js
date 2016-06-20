var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var coffee = require('gulp-coffee');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var connect = require('gulp-connect');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');

gulp.task('jade', function(){
  gulp.src(['src/jade/**/*.jade'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('.'))
    .pipe(gulpif(argv.live, connect.reload()))
});

gulp.task('scss', function(){
  gulp.src(['src/sass/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('css/'))
    .pipe(gulpif(argv.live, connect.reload()))
});

gulp.task('service-worker', function(){
  return gulp.src('src/service-worker/service-worker.coffee')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(coffee({bare: true}))
    .pipe(gulp.dest('./'))
    .pipe(gulpif(argv.live, connect.reload()))
});

gulp.task('scripts', function(){
  return gulp.src('src/coffee/**/*.coffee')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(coffee({bare: true}))
    .pipe(gulp.dest('js/'))
    .pipe(gulpif(argv.live, connect.reload()))
});

gulp.task('publish', function(){
  gulp.src(['index.html'], { base: '.' })
    .pipe(gulp.dest('./publish'));
  gulp.src(['css/**/*.css'], { base: 'css' })
    .pipe(gulp.dest('./publish/css'));
  gulp.src(['js/**/*.js'], { base: 'js' })
    .pipe(gulp.dest('./publish/js'));
  gulp.src(['res/**/*'], { base: 'res' })
    .pipe(gulp.dest('./publish/res'));
  gulp.src(['bower_components/**/*'], { base: 'bower_components' })
    .pipe(gulp.dest('./publish/bower_components'));
});

gulp.task('build', ['jade', 'scss', 'scripts', 'service-worker']);

gulp.task('serve', function() {
  connect.server({livereload: argv.live});
});

gulp.task('default', ['serve'], function(){
  gulp.watch("src/jade/**/*.jade", ['jade']);
  gulp.watch("src/sass/**/*.scss", ['scss']);
  gulp.watch("src/coffee/**/*.coffee", ['scripts']);
  gulp.watch("src/service-worker/service-worker.coffee", ['service-worker']);
});
