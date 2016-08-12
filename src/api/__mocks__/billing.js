import express from 'express';
import bodyParser from 'body-parser';
import { Billing } from '../../constants';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const countries = [
	{ isocode: 'AUS', name: 'Australia' },
	{ isocode: 'ENG', name: 'England' },
	{ isocode: 'USA', name: 'America' },
	{ isocode: 'IRE', name: 'Ireland' },
	{ isocode: 'ITA', name: 'Italy' }
];

app.get(Billing.COUNTRYLIST, function named(req, res) {
	setTimeout(() => {
		res.send(JSON.stringify({
			success: true,
			data: {
				countries
			}
		}));
	}, Math.random() * 1000);
});

app.post(Billing.SETADDRESS, function named(req, res) {
	setTimeout(() => {
		const { ctoken, countryCode, ...formData } = req.body;
		const billingAddress = { ...formData };

		if (!!req.body.singleLineLabel) {
			const vals = req.body.singleLineLabel.split(', ');
			billingAddress.line1 = vals[0];
			billingAddress.postalCode = vals[1];
			billingAddress.state = vals[2];
			billingAddress.town = 'SingleLineVille';
		}

		const countryName = !!countryCode ?
			countries
				.filter(country => country.isocode === countryCode)
				.reduce(country => country.name) :
			'Australia';
		// note: When no countrycode is given, default to Australia (with singleline)
		res.send(JSON.stringify({
			success: !!ctoken,
			data: {
				billingAddress: { country: { name: countryName }, ...billingAddress }

			}
		}));
	}, Math.random() * 1000);
});


export default app;
