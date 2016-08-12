import express from 'express';
import bodyParser from 'body-parser';
import { Payment } from '../../constants';
import state from './state';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get(Payment.APPLICABLE_METHODS, function named(req, res) {
	setTimeout(() => {
		const available = {
			ipg: Math.random() < 0.8,
			giftcard: Math.random() < 0.8
		};
		const ipg = available.ipg ? {
			name: 'ipg',
			available: available.ipg,
			reason: null
		} : null;
		const giftcard = available.ipg ? {
			name: 'giftcard',
			available: available.giftcard,
			reason: !available.giftcard ? 'Gift cards cannot be used to purchase gift cards' : null
		} : null;

		const paymentMethods = [
			{ ...giftcard },
			{ ...ipg },
			{
				name: 'paypal',
				available: true,
				reason: !available.ipg ? 'Credit and gift card payments currently unavailable. ' +
					'We recommend PayPal.' : null
			}
		].filter(value => !!value.name);
		res.send(JSON.stringify({
			success: true,
			data: {
				paymentMethods
			}
		}));
	}, Math.random() * 1000);
});

app.post(Payment.SET_IPG_MODE, function named(req, res) {
	setTimeout(() => {
		const ipgMode = req.body.id;
		let data;
		const sessionIdCc = 'mockSessionId_new';
		const sessionIdGc = 'mockSessionId_giftcard';
		const url = '/ws-api/v1/target/mock-iframe-ipg-info?SST=mockSST&sessionId=';

		const sessionId = ipgMode === 'ipg' ? sessionIdCc : sessionIdGc;

		if (ipgMode === 'ipg' || ipgMode === 'giftcard') {
			data = {
				paymentMethod: ipgMode,
				iframeUrl: url + sessionId,
				sessionId,
				SST: 'mockSST'
			};
		} else {
			data = {
				error: {
					code: 'ERR_PAYMENTMODE_UNAVAILABLE',
					message: 'selected payment mode is currently unavailable.'
				}
			};
		}
		res.send(JSON.stringify({
			success: !data.error,
			data
		}));
	}, Math.random() * 1000);
});

app.post(Payment.SET_PAYPAL_MODE, function named(req, res) {
	setTimeout(() => {
		res.send(JSON.stringify({
			success: true,
			data: {
				paypalUrl: '/ws-api/v1/target/mock-paypal?token=paypalToken'
			}
		}));
	}, Math.random() * 1000);
});

const mockFailure = (code) => {
	switch (code) {
	case 'BADSTOCK':
		return 'ERR_PLACEORDER_INSUFFICIENT_STOCK';
	case 'BADPAY':
		return 'ERR_PLACEORDER_PAYMENT_FAILURE';
	case 'BADTOTAL':
	case 'BADTOTALS':
		return 'ERR_PLACEORDER_PAYMENT_FAILURE_DUETO_MISSMATCH_TOTALS';
	case 'BADCART':
		return 'ERR_PLACEORDER_INCOMPLETE_CART_DETAILS';
	case 'BADGIFT':
		return 'ERR_PLACEORDER_GIFTCARD_PAYMENT_NOT_ALLOWED';
	default:
		return 'ERR_PLACEORDER';
	}
};

app.post(Payment.PLACE_ORDER_IPG, function named(req, res) {
	const { voucher = {} } = state.get('voucher') || {};
	const success = (voucher.code || '').indexOf('BAD') < 0;
	const data = !success ? { error: { code: mockFailure(voucher.code) } } : {
		redirectUrl: '/checkout/success'
	};

	setTimeout(() => {
		res.send(JSON.stringify({
			success,
			data
		}));
	}, Math.random() * 1000);
});

export default app;
