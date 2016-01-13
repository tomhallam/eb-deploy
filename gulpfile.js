var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var plumber = require("gulp-plumber");

gulp.task("babel", function () {
  return gulp.src("src/**/*.js")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['babel']);
});
