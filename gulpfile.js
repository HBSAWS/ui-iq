var gulp = require('gulp'),
	
	batch 		   = require('gulp-batch'),
	bower          = require('gulp-bower'),
	browserSync    = require('browser-sync'),
	concat 		   = require('gulp-concat'),
	del 		   = require('del'),
	dummyJSON      = require('dummy-json'),
	jshint         = require('gulp-jshint'),
	mainBowerFiles = require('main-bower-files'),
	merge 		   = require("merge-stream"),
	minifyHTML	   = require('gulp-minify-html'),
	rename   	   = require("gulp-rename"),
	sass           = require('gulp-ruby-sass'),
	sourcemaps 	   = require('gulp-sourcemaps'),
	template  	   = require('gulp-template'),
	uglifyCSS	   = require('gulp-uglifycss'),
	uglify	   	   = require('gulp-uglify');

var config;
config = {
	is__installing : false,
	env : {
		testing : {
			get      : '$.getJSON("js/test.json", function(data) {',
			jquery   : 'js/jquery.js',
			_default : 'js/' 
		},
		staging : {
			get      : "$.getJSON( 'http://rhdevapp1.hbs.edu:9080/iqService-dev/rest/mba/bio.json?name=99', function( data ) {",
			jquery  : 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.min.js',
			_default : '/static/IQ/js/'
		},
		production : {
			get      : "",
			jquery  : 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.min.js',
			_default : '/static/IQ/js/'
		}
	},
	server : {
		is__testing  : false,
		is__running  : false,
		is__compiled : false
	}
}; 


// INSTALLATION OF LIBRARY FILES  -- START
	gulp.task('bower-download-files', function() {
		return bower();
	});

	gulp.task('bower-extract-files', ['bower-download-files'], function() {
		return gulp.src(mainBowerFiles({
			overrides : {
				"basictable" : {
					"main" : "jquery.basictable.js"
				},
				"handlebars" : {
					"main" : "handlebars.runtime.js"
				},
				"jquery"     : {
					"main" : "dist/jquery.js"
				},
				"list"       : {
					"main" : "dist/list.min.js"
				},
				"webui-popover" : {
					"main" : "dist/jquery.webui-popover.js"
				}
			}
		}))
		.pipe(gulp.dest("./dist/js/"))
	});

	gulp.task("cleanup-bower-files",["bower-extract-files"],function () {
		return del("./bower_components", function(err,paths) {
			if (err) {
				console.log(err);
			} else {
				console.log('deleted the folder:\n' + paths.join('\n'));
			}
		});
	});

// INSTALLATION OF LIBRARY FILES  -- FINISH



// SASS  -- START
	function compileSASS() {
		return sass('./src/sass/__compiler.scss')
			.on('err', sass.logError)
			.pipe(sourcemaps.write())
			.pipe(rename({
				dirname  : 'css',
				basename : 'UI',
				extname  : '.css'
			}))
			.pipe(gulp.dest('./dist'))			
			.on("end", function(){
				if (config.server.is__running) {
					testingServer.reload();
				}
			});	
	};
	gulp.task("compile-sass", compileSASS);
// SASS  -- END


// JS  -- START
	function compileJS() {
		var source,settings;
		if (config.server.is__testing) {
			source = 'testing';
		} else {
			source = 'staging';
		}
		settings = config.env[source];

		var UI = gulp.src(['./src/js/__UI.js', './src/js/UI_utilities/*.js', './src/js/UI_modules/*.js', './src/js/__api.js'])
			.pipe(sourcemaps.init())
				.pipe(concat('UI.js'))
				//.pipe(uglify())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('./dist/js'))			
			.on("end", function(){
				if (config.server.is__running) {
					testingServer.reload();
				}
			});

		var IQM = gulp.src('./src/js/IQM.js')
        	.pipe(template(settings))
			.pipe(sourcemaps.init())
				//.pipe(uglify())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('./dist/js'))			
			.on("end", function(){
				if (config.server.is__running) {
					testingServer.reload();
				}
			});	

		if (config.is__installing) {
			var moveTestJsonFile = gulp.src('./src/js/migrate/*.{js,json,JSON}')
				.pipe(gulp.dest('./dist/js'));

			return merge(moveTestJsonFile,UI,IQM);
		} else {
			return merge(UI,IQM);
		}
	};
	gulp.task("compile-js", compileJS);
// JS  -- END


// HTML  -- START 
	function compileHTML () {
		var source,settings;
		if (config.server.is__testing) {
			source = 'testing';
		} else {
			source = 'staging';
		}
		settings = config.env[source];

		return gulp.src('./src/index.html')
        	.pipe(template(settings))
			// .pipe(minifyHTML())
			.pipe(gulp.dest('./dist'))			
			.on("end", function(){
				if (config.server.is__running) {
					testingServer.reload();
				}
			});
	};
	gulp.task("compile-html", compileHTML);
// HTML  -- END




// watch and serve HTML/SASS/JS files
var testingServer = browserSync.create("testing-server");

gulp.task('serve-testing', function () {
	config.server.is__testing = true;

	if ( !config.server.is__compiled ) {
		compileHTML();
		compileSASS();
		compileJS();

		config.server.is__compiled = true;
	}

    // Serve files from the root of this project
    testingServer.init({
	    port: 5010,
	    ui: {
	        port: 5011
	    },
	    server : {
	    	directory : true,
	    	baseDir : './dist/'
	    },
	    startPath : "./index.html"
    });

    gulp.watch('./src/**/*.scss', ['compile-sass']);
    gulp.watch('./dist/css/*.css').on('change', testingServer.reload);

    gulp.watch('./src/**/*.js', ['compile-js']);
    gulp.watch('./dist/js/*.js').on('change', testingServer.reload);

    gulp.watch('./src/*.html', ['compile-html']);
    gulp.watch('./dist/*.html').on('change', testingServer.reload);    

    config.server.is__running = true;
});


// start with $npm install
// then $gulp install
// this will install all required libraries, compile and move all source files
gulp.task("install",['cleanup-bower-files'], function() {
	config.is__installing = true;

	compileHTML();
	compileSASS();
	compileJS();

	return;
});
// compiles sass, js and html files
// these can be compiled individually with '$ gulp compile-<sass/js/html>'
gulp.task("compile", ['compile-sass','compile-js', 'compile-html']);
// to test locally type $gulp serve-testing
gulp.task('default',['serve-testing']);







