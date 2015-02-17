'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var $ = require('gulp-load-plugins')();
var browserify = require('gulp-browserify');
var babelify = require("babelify");

gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(connect.static('.'))
        .use(connect.directory('.'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('serve', ['connect'], function () {
    require('opn')('http://localhost:9000');
});

gulp.task('build', function () {
    return gulp.src(['app/scripts/main.js'])
        .pipe(browserify({insertGlobals: true, transform: babelify}))
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        // .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});


gulp.task('watch', ['build', 'connect', 'serve'], function () {
    var server = $.livereload();

    gulp.watch('app/scripts/**/*.js', ['build']);

    gulp.watch([
        'app/*.html',
        'app/styles/**/*.css',
        'dist/all.js'
    ]).on('change', function (file) {
        server.changed(file.path);
    });
});
