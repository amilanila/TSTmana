var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
import ExtractTextPlugin from 'extract-text-webpack-plugin';

module.exports = function karmaConf(config) {
	var wpConfig = webpackConfig();
	delete wpConfig.entry;
	wpConfig.debug = true;
	wpConfig.plugins = wpConfig.plugins.concat(
		new ExtractTextPlugin('_', { disabled: true })
	);
	wpConfig.externals = {
		jsdom: 'window',
		'react/lib/ExecutionEnvironment': true,
		'react/lib/ReactContext': 'window',
		cheerio: 'window'
		// ExecutionEnvironment & ReactContext are used for React 0.13
		// backwards compatability. See https://github.com/airbnb/enzyme/issues/47
	};

	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: [
			'./node_modules/phantomjs-polyfill/bind-polyfill.js',
			'./node_modules/babel-polyfill/dist/polyfill.js',
			'./node_modules/whatwg-fetch/fetch.js',
			'./src/**/*.spec.js'
		],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'./src/**/*.spec.js': ['webpack']
		},

		webpack: wpConfig,

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress', 'junit'],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN ||
		// 	config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['PhantomJS', !process.env.CI ? 'Chrome' : ''],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,
		
		browserNoActivityTimeout: 60000,

		plugins: [
			require('karma-webpack'),
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-phantomjs-launcher'),
			require('karma-junit-reporter')
		],

		junitReporter: {
			// results will be saved as $outputDir/$browserName.xml
			outputDir: 'report',
			// suite will become the package name attribute in xml testsuite element
			suite: 'au.com.target.spc',
			// add browser name to report and classes names
			useBrowserName: true
		}

	});
};
