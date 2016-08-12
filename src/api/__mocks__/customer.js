import express from 'express';
import { Customer } from '../../constants';

const app = express();

app.post(Customer.CHECK_REGISTRATION, function named(req, res) {
	setTimeout(() => {
		res.send(JSON.stringify({
			success: true,
			data: {}
		}));
	}, Math.random() * 1000);
});

app.post(Customer.SIGN_IN, function named(req, res) {
	setTimeout(() => {
		res.send(JSON.stringify({
			success: true,
			data: {}
		}));
	}, Math.random() * 1000);
});

app.post(Customer.REGISTER, function named(req, res) {
	setTimeout(() => {
		res.send(JSON.stringify({
			success: true,
			data: {}
		}));
	}, Math.random() * 1000);
});

export default app;
