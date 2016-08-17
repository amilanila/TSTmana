import fs from 'fs';
import gulp from 'gulp';
import gutil from 'gulp-util';
import loadPlugins from 'gulp-load-plugins';
import del from 'del';
import { Server } from 'karma';
import webpack from 'webpack';
import webpackConfig from './webpack.config.js';
import WebpackDevServer from 'webpack-dev-server';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
// import { mockWsApi, mockCmsApi } from './src/api/__mocks__';
import express from 'express';
import ejs from 'ejs';

const plugins = loadPlugins();

const distFolder = './dist/';
const assetsFolder = './dist/_assets/';
const appShellFolder = './app-shell/';

const getTemplate = () => ejs.compile(fs.readFileSync(__dirname + '/src/template.ejs', 'utf-8'));

gulp.task('default', ['dev']);

gulp.task('dev', () => {
	const port = 8010;
	const devConfig = Object.create(webpackConfig(/* hot */ true));
	devConfig.entry = [
		'webpack-dev-server/client?https://localhost:' + port,
		'webpack/hot/only-dev-server',
		...devConfig.entry
	];
	devConfig.plugins = devConfig.plugins.concat(
		new ExtractTextPlugin('styles.css', { disabled: true }),
		new webpack.HotModuleReplacementPlugin()
	);
	devConfig.devtool = 'inline-source-map';

	gutil.log(gutil.env.hybris ? 'Proxying non `/tmana` traffic to https://localhost:9002' : 'Using ws-api mocks');

	const proxyHybris = gutil.env.hybris ? [{
		path: /^\/[^s][^p][^c]/,
		target: 'https://localhost:9002',
		secure: false
	}] : [];

	const server = new WebpackDevServer(webpack(devConfig), {
		publicPath: '/tmana/_assets/',
		contentBase: './src/',
		https: true,
		stats: {
			colors: true
		},
		proxy: [...proxyHybris]
	});

	// Mock '/ws-api/'
	// server.use(mockWsApi.mountPath, mockWsApi.handler);

	// Mock CMS '/'
	// server.use(mockCmsApi.mountPath, mockCmsApi.handler);

	// Mount the /tmana path to sure up the base html (just like the deployment)
	const tmana = express();
	tmana.get('*', function named(req, res) {
		const template = ejs.compile(fs.readFileSync(__dirname + '/src/template.ejs', 'utf-8'));
		res.send(template({ html: '<p>Loading.........</p>' }));
	});
	server.use('/tmana', tmana);

	// Start web dev server
	server.listen(port, (err) => {
		if (err) throw new gutil.PluginError('webpack-dev-server', err);
		gutil.log('[webpack-dev-server]', 'https://localhost:' + port + '/webpack-dev-server/');
	});
});

gulp.task('build:dist', ['clean'], (done) => {
	const distConfig = Object.create(webpackConfig());
	distConfig.plugins = distConfig.plugins.concat(
		new ExtractTextPlugin('styles.css', { allChunks: true }),
		new webpack.DefinePlugin({
			'process.env': {
				// This has effect on the react lib size
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);

	// The /dist/ folder is the folder that is deployed to https://www.target.com.au/tmana/
	// Therefore we want all webpacked assets in https://www.target.com.au/tmana/_assets/
	distConfig.output.path = __dirname + '/dist/_assets';

	const commonjsConfig = Object.create(webpackConfig(undefined, true));
	commonjsConfig.plugins = [
		new webpack.DefinePlugin({
			'process.env': {
				// This has effect on the react lib size
				NODE_ENV: JSON.stringify('production')
			}
		})
	];
	commonjsConfig.target = 'node';
	commonjsConfig.output = {
		path: __dirname + '/app-shell',
		contentBase: './src/',
		filename: '[name].js',
		chunkFilename: 'chunk-[name].js',
		libraryTarget: 'commonjs2'
	};

	webpack([distConfig, commonjsConfig], (err, stats) => {
		if (err) throw new gutil.PluginError('build', err);
		gutil.log('[build]', stats.toString({
			colors: true
		}));
		done();
	});
});

gulp.task('revision', ['build:dist'], () => {
	return gulp.src([
		assetsFolder + 'main.js',
		assetsFolder + 'styles.css'
	])
	.pipe(plugins.rev())
	.pipe(gulp.dest(assetsFolder))
	.pipe(plugins.rev.manifest())
	.pipe(gulp.dest(distFolder));
});

gulp.task('app-shell', ['build:dist'], (done) => {
	const appShell = require(appShellFolder + 'main.js');

	appShell({
		path: '/tmana/',
		template: getTemplate()
	}, (stats, output) => {
		fs.writeFileSync(appShellFolder + 'index.html', output);
		done();
	});
});

gulp.task('dist', ['revision', 'app-shell'], () => {
	const manifest = gulp.src(distFolder + '/rev-manifest.json');
	fs.accessSync(appShellFolder + 'index.html', fs.F_OK);
	return gulp.src(appShellFolder + 'index.html')
		.pipe(plugins.revReplace({ manifest }))
		.pipe(gulp.dest(distFolder));
});

gulp.task('build', ['clean'], (done) => {
	webpack(webpackConfig(), (err, stats) => {
		if (err) throw new gutil.PluginError('webpack:build', err);
		gutil.log('[webpack:build]', stats.toString({
			colors: true
		}));
		done();
	});
});

gulp.task('clean', () => del(['./dist', './app-shell']));

gulp.task('lint', () => {
	const junit = fs.createWriteStream('./report/lint.xml');
	return gulp.src('./src/**/*.js')
		.pipe(plugins.eslint({ configPath: './.eslintrc.json' }))
		.pipe(plugins.eslint.format())
		.pipe(plugins.eslint.format('junit', junit))
        .pipe(plugins.eslint.failAfterError());
});

gulp.task('test', (done) => {
	new Server({
		configFile: __dirname + '/karma.conf.js'
	}, done).start();
});

gulp.task('test:dev', (done) => {
	console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>> ', __dirname);
	new Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: false
	}, done).start();
});

gulp.task('dev:test', ['test:dev']);

// Da kitchen Sink (if this breaks, you got problems)
// Otherwise you are sitting pretty.
gulp.task('sink:lint', ['lint']);
gulp.task('sink:test', ['test', 'sink:lint']);
gulp.task('sink:build', ['build:dist', 'sink:test', 'sink:lint']);
gulp.task('sink', ['sink:build', 'sink:test', 'sink:lint']);
