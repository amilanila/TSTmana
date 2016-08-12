var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

module.exports = function webpackConfig(hot, forceLoaderChange) {
	const getLoader = (loader) => forceLoaderChange ? 'ignore-loader' : loader;

	const js = {
		test: /\.js$/,
		exclude: /node_modules/,
		loaders: [...(hot ? ['react-hot'] : []), 'babel']
	};

	const css = {
		test: /\.css$/,
		loader: getLoader(
			ExtractTextPlugin.extract(
				'style-loader',
				'css-loader?importLoaders=1&localIdentName=' +
					'[local]__[hash:base64:5]!postcss-loader'
			)
		)
	};

	const scss = {
		test: /\.scss$/,
		loader: getLoader(
			ExtractTextPlugin.extract(
				'style-loader',
				'css-loader?importLoaders=2&localIdentName=' +
					'[local]__[hash:base64:5]!postcss-loader!sass-loader'
			)
		)
	};

	const svg = {
		test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
		loaders: [
			'file-loader?name=[name]-[hash].[ext]',
			'svgo-loader?useConfig=svgoConfig'
		]
	};

	const json = {
		test: /\.json/,
		loader: 'json'
	};

	const fonts = [{
		test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
		loader: 'file-loader'
	}, {
		test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
		loader: 'file-loader'
	}, {
		test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
		loader: 'file-loader'
	}, {
		test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
		loader: 'file-loader'
	}];

	return {
		cache: true,
		entry: [
			'./src/main.js'
		],
		output: {
			publicPath: '/tmana/_assets/',
			path: __dirname + '/dist',
			contentBase: './src/',
			filename: '[name].js',
			chunkFilename: 'chunk-[name]-[hash:10].js'
		},
		resolve: {
			extensions: ['', '.js', '.css', '.scss'],
			alias: {
				tu: __dirname + '/custom_modules/tu-css-lib/src',
				suitcssify: 'react-suitcssify/dist/lib/utility'
			}
		},
		module: {
			loaders: [js, css, scss, svg, json, ...fonts]
		},
		svgoConfig: {
			plugins: [
				{ removeTitle: true },
				{ convertColors: { shorthex: false } },
				{ convertPathData: false }
			]
		},
		postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
		plugins: []
	};
};
