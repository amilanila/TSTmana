import express from 'express';
import bodyParser from 'body-parser';
import { Cart } from '../../constants';
import state, { setPrice, getPrice, setCartEntries } from './state';

const app = express();

setPrice('subtotal', 10);
setPrice('orderDiscounts', 23.50);
setPrice('gst', 1);

const updateCartEntries = () => {
	// cart has giftcard ~50% of the time.
	const containsDigitalEntriesOnly = Math.random() < 0.5;
	state.set('containsDigitalEntriesOnly', containsDigitalEntriesOnly);
	setCartEntries();
};

const calc = () => {
	setPrice('total', getPrice('deliveryFee') + getPrice('subtotal'));
};

app.use(bodyParser.urlencoded({ extended: true }));

app.get(Cart.DETAIL, function named(req, res) {
	updateCartEntries();

	calc();
	setTimeout(() => {
		res.send(JSON.stringify({
			success: true,
			data: {
				tmid: 'f302dad92935303b594aafe8502d6',
				...state.get('deliveryFee'),
				...state.get('subtotal'),
				...state.get('total'),
				...state.get('entries'),
				...state.get('pickupDetails'),
				...state.get('selectedDeliveryMode'),
				...state.get('selectedAddress'),
				...state.get('voucher'),
				...state.get('tmdNumber'),
				...state.get('flybuysCode'),
				...state.get('orderDiscounts'),
				...state.get('gst'),
				containsDigitalEntriesOnly: state.get('containsDigitalEntriesOnly')
			}
		}));
	}, Math.random() * 1000);
});

app.get(Cart.SUMMARY, function named(req, res) {
	calc();
	setTimeout(() => {
		res.send(JSON.stringify({
			success: true,
			data: {
				...state.get('deliveryFee'),
				...state.get('subtotal'),
				...state.get('total'),
				...state.get('entries'),
				...state.get('voucher'),
				...state.get('orderDiscounts'),
				...state.get('gst')
			}
		}));
	}, Math.random() * 1000);
});

export default app;
