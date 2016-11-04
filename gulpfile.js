var gulp = require('gulp');

var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var bytediff = require('gulp-bytediff');
/*
When using standard source.pipe(dest) source will not be destroyed if dest emits close or an error.
You are also not able to provide a callback to tell when then pipe has finished.
pump does these two things for you
*/
var pump = require('pump');
var htmlreplace = require('gulp-html-replace');
var rename = require("gulp-rename");
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

var bases = {
 app: 'public/',
 dist: 'build/',
};

var paths = {
 scripts: ['app.module.js','*.js', '*/**/*.js'],
 //libs: ['scripts/libs/jquery/dist/jquery.js', 'scripts/libs/underscore/underscore.js', 'scripts/backbone/backbone.js'],
 styles: ['stylesheets/**/*.css'],
 html: ['index.html'],
 //images: ['images/**/*.png'],
 //extras: ['crossdomain.xml', 'humans.txt', 'manifest.appcache', 'robots.txt', 'favicon.ico'],
};

// Delete the dist directory
gulp.task('clean', function() {
 return gulp.src(bases.dist)
 .pipe(clean());
});

// Process scripts and concatenate them into one output file
gulp.task('scripts', ['clean'], function() {
 gulp.src(paths.scripts, {cwd: bases.app})
 .pipe(jshint())
 .pipe(jshint.reporter('default'))
 .pipe(concat('app.min.js', {newLine: ';'}))
        // Annotate before uglify so the code get's min'd properly.
        .pipe(ngAnnotate({
            // true helps add where @ngInject is not used. It infers.
            // Doesn't work with resolve, so we must be explicit there
            add: true
        }))
 .pipe(bytediff.start())
 .pipe(uglify( {mangle: true} ))
 .pipe(bytediff.stop())
 .pipe(gulp.dest(bases.dist + 'scripts/'));
});

// Copy all other files to dist directly
gulp.task('copy', ['clean'], function() {
 // Copy html
 gulp.src(paths.html, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist));

 // Copy styles
 gulp.src(paths.styles, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist + 'stylesheets'));

}); // comment this when use 'watch' task
 // A development task to run anytime a file changes
 // gulp.task('watch', function() {
 //  gulp.watch('public/**/*', ['scripts', 'copy']);
 // });


 // Define the default task as a sequence of the above tasks
 gulp.task('default', ['clean', 'scripts', 'copy', 'replace-min']);

/*
  Testing gulp.
  Check diffrent type of tasks.
  */


gulp.task('inject', function() {
  console.log('Dependency injection using ngAnnotate...');
  return gulp.src('public/**/*.js')
             .pipe(ngAnnotate())
             .pipe(gulp.dest('build'));
})

gulp.task('compress', function (cb) {
  pump([
        gulp.src('public/**/*.js'),
        uglify().on('error', function(e) {
          console.log(e);
        }),
        rename({
          suffix: '.min'
        }),
        gulp.dest('build')
    ],
    cb
  );
});

gulp.task('move-files', function() {

  return gulp.src('public/**/*.*')
        .pipe( gulp.dest('build'))

})

gulp.task('replace-min', function() {
return gulp.src(paths.html, {cwd: bases.app})
           .pipe(htmlreplace({
        //'css': 'styles.min.css',
        js: '/scripts/app.min.js'
    }))
           .pipe(gulp.dest(bases.dist));
});

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "build"
        }
    });
     gulp.watch("public/*.html").on("change", reload);
     gulp.watch("public/**/*.js").on("change", reload);
});
