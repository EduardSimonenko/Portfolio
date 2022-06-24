const {src, dest, series, watch} = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify-es').default
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const sync = require('browser-sync').create()

const htmlPath = 'src/**/*.html'
const scssPath = 'src/**/*.scss'
const scriptsPath = 'src/**/*.js'

const outputDir = 'dist'

function html() {
  return src(htmlPath)
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest(outputDir))
}

function scss() {
  return src(scssPath)
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(concat('style.css'))
    .pipe(dest(outputDir))
}

function js() {
  return src(scriptsPath)
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('index.js'))
    .pipe(dest(outputDir))
}

function images() {
  return src('src/img/')
      .pipe(dest('dist/img'))
}

function clear() {
  return del(outputDir)
}

function serve() {
  sync.init({
    server: './dist'
  })
  
  watch(htmlPath, series(html)).on('change', sync.reload)
  watch(scssPath, series(scss)).on('change', sync.reload)
  watch(scriptsPath, series(js)).on('change', sync.reload)
} 


exports.build = series(clear, scss, html, js)
exports.serve = series(clear, scss, html, js, serve)