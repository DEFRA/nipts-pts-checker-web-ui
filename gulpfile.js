import gulp from "gulp";
import * as browserSync from "browser-sync";
import eslint from "gulp-eslint";
import jest from "gulp-jest";
const { src, dest, series } = gulp;



function compileCss() {
  return src("src/web/assets/**/*.css")
    .pipe(dest("dist/src/web/assets"))
    .pipe(browserSync.create().stream());
} 

function compileJs() {
  return src(["{,src/**/}*.js", "!gulpfile.js"])
    .pipe(dest("dist"))
    .on("end", function () {
      browserSync.reload();
    });
}

function compileHtml() {
  return src("src/web/views/**/*.html")
    .pipe(dest("dist/src/web/views"))
    .on("end", function () {
      browserSync.reload();
    });
}

function moveConfig() {
  return src(["package.json", ".env"]).pipe(dest("dist"));
}

function lint() {
 return src(["src/web/component/**/*.js", "src/api/**/*.js", "!gulpfile.js"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

//write test function under src/__tests__ folder to run all the test
function test() {
   return src("src/__tests__/**/*.test.js").pipe(
     jest.default({
       preprocessorIgnorePatterns: [
         "<rootDir>/dist/",
         "<rootDir>/node_modules/",
       ],
       automock: false,
     })
   );
}


function watchFiles() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });

  gulp.watch("src/web/assets/css/*.css", compileCss);
  gulp.watch("src/**/*.js", compileJs);
  gulp.watch("src/web/views/*.html", compileHtml);
  gulp.watch(["package.json", ".env"], moveConfig);
  gulp.watch(["{,src/**/}*.js", "!gulpfile.js"], lint);
  gulp.watch("src/__tests__/**/*.test.js", test);  
} 

//export the above function as series can this be default
export default series(compileCss, compileJs, compileHtml, moveConfig, lint, test, watchFiles);




