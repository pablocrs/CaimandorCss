/**
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;

// Lint JavaScript
gulp.task('jshint', function () {
	return gulp.src('app/assets/scripts/**/*.js')
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'))
		.pipe($.jshint.reporter('fail'))
		.pipe(reload({stream: true}));
});

// Optimize Images
gulp.task('images', function () {
	return gulp.src('app/assets/images/**/*')
		.pipe($.cache($.imagemin({
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('dist/assets/images'))
		.pipe(reload({stream: true, once: true}))
		.pipe($.size({title: 'images'}));
});

// Automatically Prefix CSS
gulp.task('styles:css', function () {
	return gulp.src('app/assets/styles/**/*.css')
		.pipe($.autoprefixer('last 1 version'))
		.pipe(gulp.dest('.tmp/assets/styles'))
		.pipe(gulp.dest('dist/assets/styles'))
		.pipe(reload({stream: true}))
		.pipe($.size({title: 'styles:css'}));
});

// Compile Sass For Style Guide Components (app/styles)
gulp.task('styles:sass', function () {
	return gulp.src('app/scss/app.scss')
		.pipe($.rubySass({
			style: 'expanded',
			precision: 10,
			loadPath: ['app/assets/styles']
		}))
		.pipe($.autoprefixer('last 1 version'))
		.pipe(gulp.dest('app/assets/styles'))
		.pipe(reload({stream: true}))
		.pipe($.size({title: 'styles:sass'}));
});

// Compile Any Other Sass Files You Added (app/styles)
gulp.task('styles:scss', function () {
	return gulp.src(['app/scss/**/*.scss', '!app/scss/app.scss'])
		.pipe($.rubySass({
			style: 'expanded',
			precision: 10,
			loadPath: ['app/assets/styles']
		}))
		.pipe($.autoprefixer('last 1 version'))
		.pipe(gulp.dest('app/assets/styles'))
		.pipe($.size({title: 'styles:scss'}));
});

// Output Final CSS Styles
gulp.task('styles', ['styles:sass', 'styles:scss', 'styles:css']);

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function () {
	return gulp.src(['app/**/*','!app/scss','!app/scss/**'])
		//.pipe($.useref.assets({searchPath: '{.tmp,app}'}))
		// Concatenate And Minify JavaScript
		.pipe($.if('*.js', $.uglify()))
		// Concatenate And Minify Styles
		.pipe($.if('*.css', $.csso()))
		// Minify Html
		//.pipe($.if('*.html', $.minifyHtml()))
		.pipe(gulp.dest('dist'));
		//.pipe($.size({title: 'html'}));

});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist','.sass-cache']));

// Watch Files For Changes & Reload
gulp.task('serve', function () {
	browserSync.init({
		server: {
			baseDir: ['app', '.tmp']
		},
		notify: false
	});

	gulp.watch(['app/**/*.html'], reload);
	gulp.watch(['app/scss/**/*.{css,scss}'], ['styles']);
	gulp.watch(['app/assets/styles/**/*.css'], reload);
	gulp.watch(['.tmp/assets/styles/**/*.css'], reload);
	gulp.watch(['app/assets/scripts/**/*.js'], ['jshint']);
	gulp.watch(['app/assets/images/**/*'], ['images']);
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
	runSequence('styles', ['jshint', 'html', 'images'], cb);
});

// Run PageSpeed Insights
// Update `url` below to the public URL for your site
gulp.task('pagespeed', pagespeed.bind(null, {
	// By default, we use the PageSpeed Insights
	// free (no API key) tier. You can use a Google
	// Developer API key if you have one. See
	// http://goo.gl/RkN0vE for info key: 'YOUR_API_KEY'
	url: 'https://example.com',
	strategy: 'mobile'
}));
