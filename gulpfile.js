const entryPath = ".";

const gulp = require("gulp");

const sass = require("gulp-sass");

const sourcemaps = require('gulp-sourcemaps');

const autoprefixer = require('gulp-autoprefixer');

const browserSync = require('browser-sync').create();

sass.compiler = require('sass');

function server(cb) {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  cb()
};


function css() {
  return gulp.src('./scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: "expanded"
    }).on('error', sass.logError))
    .pipe(autoprefixer({}))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream())
}

function watch(cb) {
  gulp.watch("./scss/**/*.scss", gulp.series(css));
  gulp.watch("./*.html").on('change', browserSync.reload);
  gulp.watch("./js/*.js").on('change', browserSync.reload);
  cb();

}


function reload(cb) {
  browserSync.reload();
  cb();
}


module.exports.css = css;
module.exports.watch = watch;
module.exports.default = gulp.series(server, css, watch);



// const entryPath = ".";

// const gulp = require("gulp");
// const sass = require("gulp-sass");
// sass.compiler = require('sass');
// const sourcemaps = require("gulp-sourcemaps");
// const autoprefixer = require("gulp-autoprefixer");
// const browserSync = require("browser-sync").create();

// function compileSass(done) {
//   gulp
//     .src(entryPath + "/scss/main.scss")
//     .pipe(sourcemaps.init())
//     .pipe(sass({outputStyle: "expanded"}).on("error", sass.logError))
//     .pipe(autoprefixer())
//     .pipe(sourcemaps.write("."))
//     .pipe(gulp.dest(entryPath + "/css"));

//   done();
// }

// function watcher(done) {
//   browserSync.init({
//     server: "./" + entryPath
//   });

//   gulp.watch(entryPath + "/scss/**/*.scss", gulp.series(compileSass, reload));
//   gulp.watch(entryPath + "/*.html", gulp.series(reload));
//   gulp.watch(entryPath + "/js/*.js", gulp.series(reload));
//   done();
// }

// function reload(done) {
//   browserSync.reload();
//   done();
// }

// exports.sass = gulp.parallel(compileSass);
// exports.default = gulp.parallel(compileSass, watcher);