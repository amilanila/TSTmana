import express from 'express';
import bodyParser from 'body-parser';
import { Delivery } from '../../constants';
import state, { setPrice } from './state';

const app = express();

const getDeliveryModes = (id) => {
	let HD = 'hd';
	const modes = {
		cnc: {
			id: 'cnc',
			name: 'Click + Collect',
			description: 'Lorem ipsum',
			shortDescription: 'Lorem ipsum dolor sit amet.',
			longDescription: 'Lorem ipsum dolor sit amet, lorem ipsum dolor sit amet.',
			available: true,
			deliveryToStore: true,
			feeRange: false,
			fee: {
				value: 0,
				formattedValue: '$0.00'
			}
		},
		hd: {
			id: 'hd',
			name: 'Home Delivery',
			description: 'Lorem ipsum',
			shortDescription: 'Quisque euismod varius odio.',
			longDescription: 'Quisque euismod varius odio, quisque euismod varius odio.',
			available: true,
			deliveryToStore: false,
			feeRange: true,
			fee: {
				value: 19,
				formattedValue: '$19.00'
			}
		},
		hd_bulky: {
			id: 'hd',
			name: 'Home Delivery',
			description: 'Lorem ipsum',
			shortDescription: 'Quisque euismod varius odio.',
			longDescription: 'Quisque euismod varius odio, quisque euismod varius odio.',
			available: true,
			deliveryToStore: false,
			feeRange: false,
			fee: {
				value: 29,
				formattedValue: '$29.00'
			}
		},
		ed: {
			id: 'ed',
			name: 'Express Delivery',
			description: 'Lorem ipsum',
			shortDescription: 'Donec nec nunc non eros.',
			longDescription: 'Donec nec nunc non eros, donec nec nunc non eros.',
			available: false,
			deliveryToStore: false,
			feeRange: true,
			fee: {
				value: 12,
				formattedValue: '$12.50'
			}
		}
	};

	if (state.get('is_hd_bulky')) {
		HD = 'hd_bulky';
	}

	if (id) {
		return id === 'hd' ? modes[HD] : modes[id];
	}

	return [modes.cnc, modes[HD], modes.ed];
};

app.use(bodyParser.urlencoded({ extended: true }));

app.get(Delivery.APPLICABLE_MODES, function named(req, res) {
	setTimeout(() => {
		res.send(JSON.stringify({
			success: true,
			data: {
				deliveryModes: getDeliveryModes()
			}
		}));
	}, Math.random() * 1000);
});

const setDeliveryModeById = id => {
	const selectedDeliveryMode = {
		deliveryMode: getDeliveryModes(id)
	};

	state.set('selectedDeliveryMode', selectedDeliveryMode);
	setPrice('deliveryFee', selectedDeliveryMode.deliveryMode.fee.value);
};

app.post(Delivery.SET_MODE, function named(req, res) {
	setTimeout(() => {
		if (!req.body.ctoken || Math.random() < 0.1) {
			res.status(403);
		}

		setDeliveryModeById(req.body.id);

		res.send(JSON.stringify({
			success: true,
			data: state.get('selectedDeliveryMode')
		}));
	}, Math.random() * 1000);
});

const createStore = i => {
	return {
		formattedDistance: `${(i * 50 * Math.random()).toFixed(2)} km`,
		url: '/url',
		name: `Store ${i}`,
		storeNumber: String(i * 1000),
		address: {
			phone: '03 5512 3456',
			postalCode: `300${i}`,
			line1: `${i * 5} Target Rd`,
			line2: '',
			town: `Store ${i}`,
			building: '',
			state: 'VIC'
		},
		type: 'Target',
		available: i % 4 !== 0
	};
};

app.post(Delivery.SEARCH_STORES, function named(req, res) {
	setTimeout(() => {
		let stores = [];
		if (!!req.body.locationText && req.body.locationText !== 'nostore') {
			stores = [1, 2, 3, 4, 5].map(createStore);
		}
		res.send(JSON.stringify({
			success: true,
			data: {
				stores
			}
		}));
	}, Math.random() * 1000);
});

function toTitleCase(str) {
	return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

app.post(Delivery.SET_PICKUP_DETAILS, function named(req, res) {
	setTimeout(() => {
		const store = createStore(req.body.storeNumber / 1000);
		delete store.available;
		delete store.formattedDistance;
		state.set('pickupDetails', {
			contact: {
				title: req.body.title,
				formattedTitle: toTitleCase(req.body.title),
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				mobileNumber: req.body.mobileNumber
			},
			store
		});
		res.send(JSON.stringify({
			success: true,
			data: state.get('pickupDetails')
		}));
	}, 1000);
});

app.get(Delivery.SAVED_ADDRESSESES, function named(req, res) {
	setTimeout(() => {
		if (!state.get('deliveryAddresses')) {
			state.set('deliveryAddresses', []);
		}
		res.send(JSON.stringify({
			success: true,
			data: { deliveryAddresses: state.get('deliveryAddresses') }
		}));
	}, Math.random() * 1000);
});

app.post(Delivery.SET_ADDRESS, function named(req, res) {
	const addressId = req.body.addressId;
	const wasBulky = state.set('is_hd_bulky');
	const isBulky = addressId === '2';
	const deliveryFeeChanged = wasBulky !== isBulky;

	state.set('is_hd_bulky', isBulky);
	setDeliveryModeById(state.get('selectedDeliveryMode').deliveryMode.id);

	setTimeout(() => {
		state.set('selectedAddress', {
			deliveryFeeChanged,
			deliveryAddress: {
				id: addressId,
				firstName: 'Nick',
				lastName: 'Test',
				formattedTitle: 'Mr',
				title: 'mr',
				phone: '0400 000 000',
				line1: '123',
				line2: 'Fake Street',
				building: '',
				town: 'Geelong',
				postalCode: '3215',
				state: 'VIC'
			}
		});
		res.send(JSON.stringify({
			success: true,
			data: state.get('selectedAddress')
		}));
	}, Math.random() * 1000);
});

app.post(Delivery.CREATE_ADDRESS, function named(req, res) {
	setTimeout(() => {
		if (!state.get('deliveryAddresses')) {
			state.set('deliveryAddresses', []);
		}
		let deliveryDetails;
		if (req.body.singleLineLabel) {
			const exploded = req.body.singleLineLabel.split(', ');
			deliveryDetails = {
				line1: exploded[0],
				state: exploded[1],
				postalCode: exploded[2],
				town: ''
			};
		} else {
			deliveryDetails = {
				postalCode: req.body.postalCode,
				line1: req.body.line1,
				line2: req.body.line2,
				town: req.body.town,
				state: req.body.state
			};
		}
		const addressList = state.get('deliveryAddresses');
		const createdAddress = {
			id: String(addressList.length + 1),
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			title: toTitleCase(req.body.title),
			titleCode: req.body.titleCode,
			phone: req.body.phone,
			...deliveryDetails
		};

		addressList.push({ validDeliveryModeIds: ['hd', 'ed'], ...createdAddress });

		state.set('deliveryAddresses', addressList);
		res.send(JSON.stringify({
			success: true,
			data: {
				createdAddress
			}
		}));
	}, Math.random() * 1000);
});

const generateAddress = (numRange, streets) => {
	const result = [];
	for (let a = 0; a < streets.length; a++) {
		const postcode = String(Math.ceil(Math.random() * 5)) +
			String(Math.ceil(Math.random() * 1000));
		for (let i = numRange.lower; i < numRange.upper; i++) {
			const id = numRange.upper * a + i;
			result.push({ label: `${i} ${streets[a]} St, ${postcode}, VIC`, id });
		}
	}
	return result;
};

app.post(Delivery.SEARCH_ADDRESS, function named(req, res) {
	setTimeout(() => {
		const addressSuggestions = generateAddress(
				{ lower: 10, upper: 100 },
				['John', 'Joe', 'Joel', 'Joan', 'Joffle', 'Joffrey', 'Johnathan']
			).filter(address => {
				const regex = new RegExp('^.*' + req.body.text.toLowerCase() + '.*$');
				return regex.test(address.label.toLowerCase());
			});

		let data;
		if (addressSuggestions.length === 0) {
			data = {
				error: {
					code: 'ERR_NO_MATCH',
					message: 'Search did not return any result'
				}
			};
		} else {
			data = addressSuggestions.length > 10 ?
				{
					error: {
						code: 'ERR_TOOMANY_MATCHES',
						message: 'Too many matches found'
					}
				} :
				{
					addressSuggestions
				};
		}
		res.send(JSON.stringify({
			success: !data.error,
			data
		}));
	}, Math.random() * 1000);
});

export default app;
