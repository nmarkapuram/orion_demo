'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass  = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    ngAnnotate = require('gulp-ng-annotate'),
    connect = require('gulp-connect-multi'),
    runSequence = require('run-sequence'),
    karma = require('gulp-karma'),
    removeEmptyLines = require('gulp-remove-empty-lines'),
    xss = require('gulp-angular-xss'),
    sourcemaps = require('gulp-sourcemaps');

var jsFiles = ["estimator/app/**/*.js"],
    jsDest = 'estimator/app',
    cssFiles = ["estimator/assets/css/scss/*.scss"],
    cssDest = 'estimator/assets/css/',
    templates =['estimator/*.html','estimator/views/**/*.html'],
    devServer = connect(),
    json = ['estimator/assets/json/**/*.php'];


gulp.task('js', function () {
    var stream = gulp.src(jsFiles)
    .pipe(sourcemaps.init())
    .pipe(concat('orionEstimator.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(jsDest))
    .pipe(devServer.reload());
    return stream;
});

gulp.task('styles', function () {
  return gulp.src(cssFiles)
    .pipe(sass({
      sourceMap: 'sass',
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({browsers: [
                        '> 1%',
                        'last 2 versions',
                        'firefox >= 4',
                        'safari 7',
                        'safari 8',
                        'IE 8',
                        'IE 9',
                        'IE 10',
                        'IE 11'
                    ],cascade: false}))
    .pipe(concat('estimator.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest(cssDest))
    .pipe(devServer.reload());
});

gulp.task('lint', function() {
  return gulp.src(jsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(devServer.reload());
});   

gulp.task('connect', devServer.server({
    root: ['estimator'],
    port: 8001,
    livereload: true,
    open: {
        file: 'orionEstimator.html',
        browser: 'Google Chrome'
    }
}));

gulp.task('test', function() {
  // Be sure to return the stream
  // NOTE: Using the fake './foobar' so as to run the files
  // listed in karma.conf.js INSTEAD of what was passed to
  // gulp.src !
  return gulp.src('./foobar')
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      console.log(err);
      this.emit('end'); //instead of erroring the stream, end it
    });
});

gulp.task('reload',function(){
    gulp.src(templates).
    pipe(devServer.reload());   
});

gulp.task('reloadjson',function(){
    gulp.src(json).
    pipe(devServer.reload());
});

gulp.task('xss',function(){
    gulp.src(templates).
    pipe(xss());
})

gulp.task('autotest', function() {
  return gulp.watch(['test/*.js'], ['test']);
});

gulp.task('watch', function() {
  gulp.watch(jsFiles, ['js','lint']);
  gulp.watch(cssFiles, ['styles']);
  gulp.watch(templates, ['reload','xss']);
  gulp.watch(json, ['reloadjson']);
});

gulp.task('default', function(cb){
    runSequence('styles','js','lint','xss','connect','watch',cb);
});


