import express from 'express';
import { Discount } from '../../constants';
import state from './state';

const app = express();

// a voucher code without a 2 or 3 returns the error code ERR_VOUCHER_CONDITIONS_NOT_MET
// voucher codes containing a '2' return a successful response.
// voucher codes containing a '3' returns the error code ERR_VOUCHER_DOES_NOT_EXIST

// Example Voucher Codes
// asdf2 - valid voucher
// asdf3 - invalid voucher. Conditions not met
// asdf4 - invalid voucher. Code unknown or expired

app.post(Discount.APPLY_VOUCHER, function named(req, res) {
	setTimeout(() => {
		if (state.get('voucher') || !req.body.ctoken || req.body.code === 'ERROR') {
			res.status(403);
			res.send();
			return;
		}

		const code = req.body.code;
		const voucherValid = code.indexOf('2') >= 0 || code.indexOf('BAD') > -1;
		const errorCodeUnknown = code.indexOf('3') >= 0;

		// return an error by default
		let data = {
			error: {
				code: 'ERR_VOUCHER_CONDITIONS_NOT_MET',
				message: 'Promo Code conditions not met'
			}
		};

		if (voucherValid) {
			data = { voucher: { code } };
			state.set('voucher', data);
		} else if (errorCodeUnknown) {
			data = {
				error: {
					code: 'ERR_VOUCHER_DOES_NOT_EXIST',
					message: 'Promo Code unknown or expired'
				}
			};
			state.set('voucher', undefined);
		}
		res.send(JSON.stringify({
			success: !data.error,
			data
		}));
	}, Math.random() * 1000);
});

app.post(Discount.REMOVE_VOUCHER, function named(req, res) {
	setTimeout(() => {
		const success = Math.random() > 0.1;
		res.send(JSON.stringify({
			success
		}));
		state.delete(success ? 'voucher' : null);
	}, Math.random() * 1000);
});

app.post(Discount.APPLY_TMD, function named(req, res) {
	setTimeout(() => {
		let response;
		const code = req.body.code;
		if (code === 'VALID_TMD' || code.indexOf('2') >= 0) {
			response = { success: true, data: { tmdNumber: code } };
		} else {
			response = {
				success: false,
				error: {
					code: 'ERR_TMD_INVALID',
					message: 'We don\'t recognize that team member card number. Please check and re-submit.'
				}
			};
		}
		res.send(JSON.stringify(response));
		state.set('tmdNumber', !response.error && { tmdNumber: response.data.tmdNumber });
	}, Math.random() * 1000);
});

app.post(Discount.APPLY_FLYBUYS, function named(req, res) {
	setTimeout(() => {
		let response;
		const code = req.body.code;
		if (code === 'VALID_FLYBUYS' || code.indexOf('2') >= 0) {
			response = { success: true, data: { flybuysCode: code } };
		} else {
			response = {
				success: false,
				error: {
					code: 'ERR_FLYBUYS_INVALID',
					message: 'We don\'t recognize that flybuys card number. Please check and re-submit.'
				}
			};
		}
		res.send(JSON.stringify(response));
		state.set('flybuysCode', !response.error && { flybuysCode: code });
	}, Math.random() * 1000);
});

export default app;
