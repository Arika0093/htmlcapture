'use strict';

var gulp = require('gulp');
var config = require("config");
var path = require("path");

var watch = require("gulp-watch");
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var webpack = require("webpack");
var webpackStream = require("webpack-stream");
var webpackObfuscator = require('webpack-obfuscator');
var gulp_pug = require("gulp-pug");
var rename = require("gulp-rename");
var sass = require('gulp-sass');

var listen_port = config.serverSetup.listen_port;
var proxy_port = config.serverSetup.proxy_port;
var is_minify = config.gulpfile.is_minify;
var is_obfuscator = config.gulpfile.is_obfuscator;

// --------------------------------------------
// browserSync
gulp.task('browser-sync', () => {
	browserSync.init(null, {
		proxy: `http://localhost:${listen_port}`,
		port: proxy_port,
		open: false
	});
	gulp.watch("./public/**/*").on("change", browserSync.reload);
});

// nodemon
gulp.task('nodemon', () => {
	nodemon({
		script: './server/index.js',
		ext: 'js json yaml',
		ignore: [  // nodemon で監視しないディレクトリ
			'node_modules',
			'client',
			'public',
			'test'
		],
		env: {
			'PORT': listen_port,
			'NODE_ENV': 'development'
		},
		stdout: false  // Express の再起動時のログを監視するため
	})
	.on('readable', function() {
		this.stdout.on('data', function(chunk) {
			if (/^Database Connect Success/.test(chunk)) {
				// Express の再起動が完了したら、reload() でBrowserSync に通知。
				// ※Express で出力する起動時のメッセージに合わせて比較文字列は修正
				browserSync.reload({ stream: false });
			}
			process.stdout.write(chunk);
		});
		this.stderr.on('data', function(chunk) {
			process.stderr.write(chunk);
		});
	});
});

// --------------------------------------------
// JSX webpack with transform Babel
gulp.task("jsx-compile", () => {
	var plugins = [];
	if(is_obfuscator){
		// 難読化処理
		plugins.push(
			new webpackObfuscator({
				rotateUnicodeArray: true,
			})
		);
	}
	if(is_minify){
		// ファイルサイズ最小化
		var uglify = require("uglifyjs-webpack-plugin");
		plugins.push(
			new uglify({uglifyOptions: {ecma: 6}})
		);
	}
	webpackStream({
		entry: "./client/javascript/index.jsx",
		output: {
			//path: path.join(__dirname, "public/javascript"),
			filename: 'bundle.js',
		},
		plugins,
		module: {
			rules: [{
				test: /\.jsx?$/,
				use: [{
					loader: "babel-loader",
					options: {
						presets: [
							// ES6->ES5, JSX->JS
							['es2015', "transform-react-jsx"]
						]
					}
				}]
			}],
		},
		resolve: {
			extensions: ['.js', '.jsx'],
		},
	}, webpack)
		.pipe(gulp.dest("./public/javascript"));
});

// Jade(Pug) webpack
gulp.task("jade-compile", () => {
	gulp.src("./client/views/**/*.+(pug|html)")
		.pipe(gulp_pug({pretty: is_minify}))
		.pipe(rename((path) => {
			if(path.basename !== "index"){
				path.dirname += "/" + path.basename.replace(/\./g, "/");
				path.basename = "index";
			}
		}))
		.pipe(gulp.dest("./public/"));
});

// Sass webpack
gulp.task("sass-compile", () => {
	gulp.src("./client/css/**/*.+(sass)")
		.pipe(sass({outputStyle: 'expanded'}))
		.pipe(gulp.dest("./public/css/"));
});

// watching
gulp.task("watchResource", () => {
	gulp.watch(['./client/**/*'],
	[
		'compile',
	]);
});

// --------------------------------------------
// compile
gulp.task("compile", ["jade-compile", "jsx-compile", "sass-compile"], () => {
	
});

// serve
gulp.task('serve', ['compile', 'nodemon', 'browser-sync', 'watchResource'], function () {
	
});

