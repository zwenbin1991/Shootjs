/**
 * @name gulpfile.js
 * @description gulp配置文件
 * @author 法克@163.com
 * @date 2016-4-26
 * @version 1.0.0
 */

'use strict';

import gulp from 'gulp';
import gBabel from 'gulp-babel';

gulp.task('babel', () => {
    return gulp.src('es6/**/*.js')
                .pipe(gBabel({ presets: ['es2015'] }))
                .pipe(gulp.dest('src'));
});

gulp.task('default', ['babel']);



