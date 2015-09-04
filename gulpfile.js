/* jshint node:true */
'use strict';
var gulp = require('gulp');
var concat = require('gulp-concat-util');
var jshint = require('gulp-jshint');
var rimraf = require('gulp-rimraf');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');

var scripts = [
  'src/*.js',
  'src/module/module.js'
]

gulp.task('jshint', function() {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean', function(cb) {
  rimraf('target/*', cb);
});

gulp.task('concat', function() {
  gulp.src(scripts)
    .pipe(sourcemaps.init())
    .pipe(concat('oig.js', {
      process: function(src) {
        return (src.trim() + '\n').replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
      }
    }))
    .pipe(concat.header('﻿/*! OIG MVVM (c) 2015 */(function (/*!oig*/exports, /*!imij*/module) {\n\'use strict\';\n'))
    .pipe(concat.footer('\n﻿})(window);\n'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./target'));
});

gulp.task('compress', function() {
  return gulp.src('target/oig.js')
    .pipe(uglify({
      preserveComments: 'license'
    }))
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('target'));
});

gulp.task('connect', function() {
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var app = require('connect')()
    .use(serveStatic('demo'))
    .use(serveStatic('target'))
    .use(serveIndex('demo'));

  require('http').createServer(app)
    .listen(8000)
    .on('listening', function() {
      console.log('Started connect web server on http://localhost:8000');
    });
});

gulp.task('serve', ['compile', 'connect']);
gulp.task('compile', ['clean', 'concat']);
gulp.task('build', ['jshint', 'compile', 'compress']);
gulp.task('default', ['build']);
