'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded',
    includePaths: 'node_modules/chartist/dist/scss'
};

gulp.task('sass', function() {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass(sassOptions))
        .pipe(gulp.dest('.'))
});