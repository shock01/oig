/* jshint node:true */
'use strict';
// generated on 2014-12-11 using generator-gulp-webapp 0.2.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('jshint', function () {
  return gulp.src('app/src/oig/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist', 'target']));

gulp.task('connect', function () {
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var app = require('connect')()
    .use(require('connect-livereload')({port: 35729}))
    .use(serveStatic('app'))
    .use(serveIndex('app'));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
      console.log('Started connect web server on http://localhost:9000');
    });
});

gulp.task('serve', ['connect', 'watch'], function () {

});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/*.html')
    .pipe(wiredep())
    .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect'], function () {
  $.livereload.listen();

  // watch for changes
  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'src/**/*.js'
  ]).on('change', $.livereload.changed);

  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('build', ['jshint'], function () {
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
