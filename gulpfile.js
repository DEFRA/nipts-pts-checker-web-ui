import gulp from "gulp";
import eslint from "gulp-eslint";
import jest from "gulp-jest";
import sassModule from "gulp-sass";
import dartCompiler from "sass";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
const { src, dest, series } = gulp;

const sass = sassModule(dartCompiler);

function copyLibraries() {
  return src("node_modules/html5-qrcode/html5-qrcode.min.js").pipe(
    dest("dist/web/assets/javascripts")
  );
}

function bundleJs() {
  return src("src/web/assets/javascripts/scan.js")
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(
      uglify({
        compress: {
          drop_console: false, 
        },
      })
    )
    .pipe(dest("dist/web/assets/javascripts"));
}

function compileCss() {
  return src("src/web/assets/**/*.css").pipe(dest("dist/web/assets"));
}

function compileJs() {
  return src(["{,src/**/}*.js", "!gulpfile.js"]).pipe(dest("dist"));
}

function compileHtml() {
  return src("src/web/views/**/*.html").pipe(dest("dist/web/views"));
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


export default series(
  copyLibraries,
  bundleJs,
  compileCss,
  compileJs,
  compileHtml,
  moveConfig,
  lint
);
