import express from 'express';
import fs from 'fs';
import ejs from 'ejs';
import state from './state';

const app = express();

app.get('/mock-iframe-ipg-info', function named(req, res) {
	const template = ejs.compile(fs.readFileSync(__dirname + '/iframe.ejs', 'utf-8'));
	setTimeout(() => {
		res.send(template({
			sessionId: req.query.sessionId,
			SST: req.query.SST,
			total: state.get('total'),
			postmessage: false
		}));
	}, 1000);
});

app.get('/mock-iframe-ipg-return', function named(req, res) {
	const template = ejs.compile(fs.readFileSync(__dirname + '/iframe.ejs', 'utf-8'));
	setTimeout(() => {
		res.send(template({
			postmessage: req.query.postmessage,
			csrfToken: state.get('csrfToken')
		}));
	}, 1000);
});

app.get('/mock-paypal', function named(req, res) {
	const template = ejs.compile(fs.readFileSync(__dirname + '/paypal.ejs', 'utf-8'));
	setTimeout(() => {
		res.send(template({
			token: req.query.token,
			total: state.get('total')
		}));
	}, 1000);
});

export default app;
