var gulp = require('gulp'),
		jshint = require('gulp-jshint'),
		uglify = require('gulp-uglify'),
		concat = require('gulp-concat');
gulp.task('application', function () {
    gulp.src(['./client/application/scripts/*/*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify())
      .pipe(concat('application.min.js'))
      .pipe(gulp.dest('./client/build'));
});
gulp.task('management', function () {
	gulp.src(['./client/management_system/scripts/controller/*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify())
      .pipe(concat('management.min.js'))
      .pipe(gulp.dest('./client/build'));
});