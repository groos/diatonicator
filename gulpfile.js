var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    webpack = require('webpack-stream');

gulp.task('default', function() {
  return gulp.src('app/index.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/'));
});

gulp.watch('app/*.js', ['test', 'build-js']);

gulp.task('build-js', function() {
    return gulp.src('app/index.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/'));
});

gulp.task('test', function() {
    return gutil.log('saw a change!');
});