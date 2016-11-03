'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const concatCss = require('gulp-concat-css');
const babel = require('rollup-plugin-babel');
const rollup = require('gulp-rollup');

const sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded',
    includePaths: 'node_modules/chartist/dist/scss'
};

gulp.task('default', ['sass', 'css', 'scripts']);

gulp.task('sass', function() {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass(sassOptions))
        .pipe(gulp.dest('./src'))
});

gulp.task('scripts', function() {
    gulp.src(
        './src/chartist-plus.js'
    )
    .pipe(rollup({
        entry: './src/chartist-plus.js',
        plugins: [
            babel({
                exclude: 'node_modules/**',
                presets: ['es2015-rollup'],
            })
        ],
        context: 'global'
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('css', ['sass'], function() {
   return gulp.src(['node_modules/chartist-plugin-tooltips/dist/chartist-plugin-tooltip.css', './src/chartist-plus.css'])
       .pipe(concatCss('chartist-plus.css'))
       .pipe(gulp.dest('./dist', {overwrite: true}))
});