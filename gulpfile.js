var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    webpack = require('webpack-stream');
    sass = require('gulp-sass');
    browserSync = require('browser-sync').create();

gulp.task('default', ['build-js'], function() {
    browserSync.init({
        server: {
            baseDir: './app',
            routes : {
                '/node_modules' : './node_modules',
                '/dist' : './dist'
            }
        }
    })

    gulp.watch('app/*.scss', ['sass']);
    gulp.watch('app/*.js', ['js-watch']);
    gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('build-js', function() {
    return gulp.src('app/index.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/'))
    .pipe(gulp.dest('app/dist'));
});

gulp.task('js-watch', ['build-js'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('sass', function() {
    return gulp.src('app/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
        stream: true
    }))
});