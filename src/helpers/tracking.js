const getGA = () => (...args) => {
	if (typeof window !== 'undefined' && window.ga) {
		window.ga(...args);
	}

	if (process.env.NODE_ENV !== 'production') {
		/* eslint-disable */
		console.log('ga', ...args);
		/* eslint-enable */
	}
};

let domain = 'none';
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
	const host = window.location.hostname;
	domain = ['target.com.au', 'tnet.internal', 'tonline.local'].reduce(
		(value, potential) => host.indexOf(potential) > 0 ? potential : value
	, '');
}

export const create = (propertyId) => {
	getGA()('create', propertyId, {
		cookieDomain: domain,
		siteSpeedSampleRate: 25,
		allowLinker: true
	});
	getGA()('require', 'ec');
};

/*
 * fn: trackPage
 * Sets the current page attribute and tracks the current page
 */
export const trackPage = (url) => {
	// Set page url for any further events
	getGA()('set', { page: url });

	// Track the actual page view
	getGA()('send', 'pageview');
};

/*
 * fn: trackEvent
 * Track normal interaction event
 */
export const trackEvent = ({
	category = 'SPC',
	action,
	label
}, ...rest) => {
	getGA()('send', 'event', category, action, label, ...rest);
};

/*
 * fn: trackPassiveEvent
 * Track event that does not affect the bounce rate
 */
export const trackPassiveEvent = (options) => {
	trackEvent(options, {
		nonInteraction: true
	});
};

export const setProducts = () => {
	getGA()('ec:addProduct', { id: 'P1234567890', name: 'Phantom Product' });
};

export const setCheckoutStep = (data) => {
	setProducts();
	getGA()('ec:setAction', 'checkout', data);
};

export const setCheckoutOption = (data) => {
	getGA()('ec:setAction', 'checkout_option', data);
};
