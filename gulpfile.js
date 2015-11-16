var gulp = require('gulp'),
	
	batch 		    = require('gulp-batch'),
	bower           = require('gulp-bower'),
	browserSync     = require('browser-sync'),
	concat 		    = require('gulp-concat'),
	del 		    = require('del'),
	fs              = require('fs'),
	jshint          = require('gulp-jshint'),
	mainBowerFiles  = require('main-bower-files'),
	merge 		    = require("merge-stream"),
	minifyHTML	    = require('gulp-minify-html'),
	parseString     = require('xml2js').parseString,
	proxyMiddleware = require('http-proxy-middleware'),
	rename   	    = require("gulp-rename"),
	sass            = require('gulp-ruby-sass'),
	shell           = require('shelljs'),
	sourcemaps 	    = require('gulp-sourcemaps'),
	template  	    = require('gulp-template'),
	uglifyCSS	    = require('gulp-uglifycss'),
	uglify	   	    = require('gulp-uglify'),
	xml2js          = require('xml2js');

var MOCK_API        = require("./API/app");


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

	gulp.task('bower-update-file-names', ['bower-download-files'], function() {
		return gulp.src('./bower_components/fastdom/index.js')
			.pipe(rename({
				basename : 'fastDOM',
				extname  : '.js'
			}))
			.pipe(gulp.dest("./bower_components/fastdom/"))
	});
	gulp.task('bower-extract-files', ['bower-update-file-names'], function() {
		return gulp.src(mainBowerFiles({
			overrides : {
				"drop" : {
					"main" : "dist/js/drop.js"
				},
				"fastdom" : {
					"main" : "fastDOM.js"
				},
				"jquery" : {
					"main" : "dist/jquery.js"
				},
				"list" : {
					"main" : "dist/list.min.js"
				},
				"movejs" : {
					"main" : "move.js"
				},
				"tether" : {
					"main" : "dist/js/tether.js"
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
					localServer.reload();
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

		var UI = gulp.src(['./src/js/UI_utilities/*.js', './src/js/UI_modules/*.js', './src/js/__api.js'])
			.pipe(sourcemaps.init())
				.pipe(concat('UI.js'))
				//.pipe(uglify())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('./dist/js'))			
			.on("end", function(){
				if (config.server.is__running) {
					localServer.reload();
				}
			});

		var IQM = gulp.src('./src/js/IQM.js')
        	.pipe(template(settings))
			.pipe(sourcemaps.init())
				//.pipe(uglify())
			.pipe(jshint())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('./dist/js'))			
			.on("end", function(){
				if (config.server.is__running) {
					localServer.reload();
				}
			});	
		return merge(UI,IQM);
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
					localServer.reload();
				}
			});
	};
	gulp.task("compile-html", compileHTML);
// HTML  -- END



gulp.task('start-API', function() {
	MOCK_API.listen(8080)
});


gulp.task('start-server', function () {
	config.server.is__testing = true;
	if ( !config.server.is__compiled ) {
		compileHTML();
		compileSASS();
		compileJS();

		config.server.is__compiled = true;
	}

	// watch and serve HTML/SASS/JS files
	localServer = browserSync.create("local-server");
    // Serve files from the root of this project
    localServer.init(null, {
		proxy     : 'http://localhost:8080',
		port      : 5010,
		startPath : '/static/',
		ui        : {
		    port: 5011
		},
    });

    gulp.watch('./src/**/*.scss', ['compile-sass']);
    gulp.watch('./dist/css/*.css').on('change', localServer.reload);

    gulp.watch('./src/**/*.js', ['compile-js']);
    gulp.watch('./dist/js/*.js').on('change', localServer.reload);

    gulp.watch('./src/*.html', ['compile-html']);
    gulp.watch('./dist/*.html').on('change', localServer.reload);    

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
// to test locally type $gulp start-server
gulp.task('default',['start-server']);












gulp.task("convertXML", function() {
	var parser = new xml2js.Parser();
	fs.readFile(__dirname + '/src/xml/bio.xml', function(err, data) {
		console.log(data);
	    parser.parseString(data, function (err, result) {
	        var convertedJSON = JSON.stringify(result);
	       	fs.writeFile('./src/js/bio.json',convertedJSON );
	    });
	});
});








