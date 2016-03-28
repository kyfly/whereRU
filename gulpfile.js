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
gulp.task('appServices', function () {
      gulp.src(['./client/services/*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify())
      .pipe(concat('app-services.min.js'))
      .pipe(gulp.dest('./client/build'));
});
gulp.task('materialize', function () {
      gulp.src(['./client/lib/materialize/js/angular-materialize.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify())
      .pipe(concat('angular-materialize.min.js'))
      .pipe(gulp.dest('./client/build'));
});
gulp.task('school', function () {
      gulp.src(['./client/lib/school/hdu.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify())
      .pipe(concat('school.min.js'))
      .pipe(gulp.dest('./client/build'));
});