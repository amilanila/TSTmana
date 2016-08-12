import { browserHistory } from 'react-router';
import paths from './paths';
import { Pages } from '../constants';
import { setLocationHref } from '../helpers/browser';

const NEXT_TICK = 15;

let redirectCommitted;

export const redirect = (path) => {
	console.log('paaaaaaaaaaaaaaaaaaaaaaaaathhhhhhhhhhhhhhhhhhh = ' + path);
	if (!redirectCommitted) {
		// Ensure another module cannot try to redirect.
		redirectCommitted = true;

		// Show the user a friendly redirect screen
		browserHistory.replace(paths.APP + paths.REDIRECT);

		// Enqueue a location redirect
		setTimeout(() => {
			setLocationHref(path);
		}, NEXT_TICK);
	}
};

export default {
	replaceWithLogin() {
		browserHistory.replace(paths.APP + paths.LOGIN);
	},
	replaceWithCheckout() {
		browserHistory.replace(paths.APP + paths.HOME);
	},
	replaceWithCheckoutRedirect() {
		// TODO use redirect()
		setLocationHref(Pages.CHECKOUT);
	},
	replaceWithPlaceOrder() {
		browserHistory.replace(paths.APP + paths.PLACEORDER);
	},
	redirectToLogin() {
		redirect(Pages.CHECKOUT_LOGIN);
	},
	redirectToBasket() {
		redirect(Pages.BASKET);
	}
};
