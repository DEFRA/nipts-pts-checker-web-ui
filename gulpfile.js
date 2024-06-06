import gulp from "gulp";
import eslint from "gulp-eslint";
import jest from "gulp-jest";
import sassModule from "gulp-sass";
import dartCompiler from "sass";
const { src, dest, series } = gulp;

const sass = sassModule(dartCompiler);

function compileCss() {
  return src("src/web/assets/**/*.css").pipe(dest("dist/src/web/assets"));
}

function compileJs() {
  return src(["{,src/**/}*.js", "!gulpfile.js"]).pipe(dest("dist"));
}

function compileHtml() {
  return src("src/web/views/**/*.html").pipe(dest("dist/src/web/views"));
}

function moveConfig() {
  return src(["package.json", ".env"], { allowEmpty: true }).pipe(dest("dist"));
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

//export the above function as series can this be default
export default series(
  compileCss,
  compileJs,
  compileHtml,
  moveConfig,
  lint
);
