var gulp = require('gulp'),
		jshint = require('gulp-jshint'),
		uglify = require('gulp-uglify'),
		concat = require('gulp-concat');
gulp.task('application', function () {
    gulp.src(['./client/application/scripts/*/*.js', './client/services/*.js', 
      './client/lib/materialize/js/angular-materialize.js', './client/lib/school/hdu.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify())
      .pipe(concat('application.min.js'))
      .pipe(gulp.dest('./client/build'));
});
gulp.task('management', function () {
	gulp.src(['./client/management_system/scripts/controller/*.js', './client/services/*.js', 
            './client/lib/materialize/js/angular-materialize.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify())
      .pipe(concat('management.min.js'))
      .pipe(gulp.dest('./client/build'));
});
gulp.task('static', function () {
      gulp.src([
            './client/lib/jquery/jquery.min.js',
            './client/lib/angular/angular.min.js',
            './client/lib/qrcode/qrcode.min.js',
            './client/lib/materialize/js/materialize.min.js',
            './client/lib/ueditor/ueditor.config.js',
            './client/lib/ueditor/ueditor.all.min.js',
            './client/lib/angular-ueditor/angular-ueditor.min.js',
            './client/lib/angular-components/angular-ui-router.min.js',
            './client/lib/angular-components/angular-resource.min.js'
      ])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify())
      .pipe(concat('components.min.js'))
      .pipe(gulp.dest('./client/build'));
});