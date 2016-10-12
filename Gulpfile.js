'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded',
    includePaths: 'node_modules/chartist/dist/scss'
};

gulp.task('default', ['sass', 'css']);

gulp.task('sass', function() {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass(sassOptions))
        .pipe(gulp.dest('.'))
});

gulp.task('css', ['sass'], function() {
   return gulp.src(['node_modules/chartist-plugin-tooltips/dist/chartist-plugin-tooltip.css', 'chartist-plus.css'])
       .pipe(concatCss('chartist-plus.css'))
       .pipe(gulp.dest('.', {overwrite: true}))
});