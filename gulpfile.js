var gulp         = require('gulp');
var sass         = require('gulp-sass');
var browserSync  = require('browser-sync').create();
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var gulpIf       = require('gulp-if');
var minifyCSS    = require('gulp-minify-css');
var imagemin     = require('gulp-imagemin');
var cache        = require('gulp-cache');
var del          = require('del');
var gulpSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps   = require('gulp-sourcemaps');
var concat       = require('gulp-concat');
var plumber      = require('gulp-plumber');

// Refresh Browser
gulp.task('browserSync', function(){
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    });
});

// Clean Dist Folder
gulp.task('clean', function(){
    return del(['dist/**/*']);
});

// Images Minify
gulp.task('images', function() {
    return gulp.src('app/img/**/*.+(png|jpg|gif|svg))')
        .pipe(plumber())
        .pipe(cache(imagemin({
            optimizationLevel: 5,
            progressive: true, 
            interlaced: true 
        })))
        .pipe(gulp.dest('dist/img'))
}); 


 // Concatenate & Minify JS
gulp.task('scripts', function(){
    return gulp.src('app/js/src/*.js')
        .pipe(plumber())
        .pipe(concat('all.js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({
        stream: true
    }))
});

// Compile & Concatenate Sass
gulp.task('sass', function(){
    return gulp.src('app/sass/*.scss')
    .pipe(plumber())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(concat('styles.css'))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
        stream: true
    }))
});

// Watch Files For Changes
gulp.task('watch', function(){
    gulp.watch('app/js/src/*.js', ['scripts']);
    gulp.watch('app/sass/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
});

// Move To Dist Folder
gulp.task('dist', function(){
    gulp.src(['app/js/*.js'])
        .pipe(gulp.dest('dist/js/'))
    gulp.src(['app/*.+(html|php)'])
        .pipe(gulp.dest('dist'));
    gulp.src(['app/css/*'])
        .pipe(gulp.dest('dist/css'));
});

// Deploy Task (gulp build)
gulp.task('build', gulpSequence('clean',['dist','images'])
);
// Default Task (gulp)
gulp.task('default', ['sass', 'scripts', 'watch', 'browserSync']);