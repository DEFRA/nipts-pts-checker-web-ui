import gulp from 'gulp';
import eslint from 'gulp-eslint';
import jest from 'gulp-jest';

// Lint Task
gulp.task('lint', function() {
  return gulp.src(['./api/**/*.js', './helper/**/*.js', './web/**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// Test Task
gulp.task('test', function() {
    return gulp.src('./web/component/checker/home/*.test.js').pipe(jest.default({
        preprocessorIgnorePatterns: [
            "<rootDir>/dist/", "<rootDir>/node_modules/"
        ],
        automock: false
    }));
});

// Watch Task
gulp.task('watch', function() {
    gulp.watch(['./api/**/*.js', './helper/**/*.js', './web/**/*.js'], gulp.series('lint', 'test'));
});
// Default Task
gulp.task('default', gulp.series('lint', 'test', 'watch'));