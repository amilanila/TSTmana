#!/usr/bin/env node

var fs = require('fs');
var series = require('async-series');
var spawn = require('child_process').spawn;

var customModulesDir = './custom_modules';
var module = '/tu-css-lib';

function feedback(data) {
	console.log(data.toString());
}

function run(options) {
	return function(done) {
		var cmd = spawn(options.command, options.args, {
			cwd: options.cwd
		});

		cmd.stdout.on('data', feedback);
		cmd.stderr.on('data', feedback);
		cmd.on('error', feedback);
		cmd.on('close', done);
	};
}

if (!fs.existsSync(customModulesDir)) {
	fs.mkdirSync(customModulesDir);
}

if (!fs.existsSync(customModulesDir + module)) {
	series([
		run({
			command: 'git',
			args: ['clone', 'https://bitbucket.org/target-ondemand' + module],
			cwd: customModulesDir
		}),
		run({
			command: 'cmd.exe',
			args: ['/c', 'npm.cmd', 'install'],
			cwd: customModulesDir + module
		})
	], function ready() {
		console.log(customModulesDir + ' installed.');
	});
} else {
	console.log(customModulesDir + module + ' is already installed. No action take.');
	console.log('You make need to rebase it yourself');
}
