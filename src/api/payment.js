import { API_END_POINT, Payment } from '../constants';
import { extractProp, extractAll, get, post } from './common';

export const applicableMethods = () => {
	return get(API_END_POINT + Payment.APPLICABLE_METHODS)
		.then(extractProp('paymentMethods'));
};

export const setIpgMode = (ipgMode, csrfToken) => {
	if (!ipgMode || !csrfToken) {
		return Promise.reject('Missing args');
	}
	return post(API_END_POINT + Payment.SET_IPG_MODE, {
		body: `id=${ipgMode}&ctoken=${csrfToken}`
	})
	.then(extractAll());
};

export const setPayPalMode = (csrfToken) => {
	if (!csrfToken) {
		return Promise.reject('Missing args');
	}
	return post(API_END_POINT + Payment.SET_PAYPAL_MODE, {})
	.then(extractAll());
};

export const placeOrderIpg = (SST, sessionId, csrfToken) => {
	if (!csrfToken || !SST || !sessionId) {
		return Promise.reject('Missing args');
	}
	return post(API_END_POINT + Payment.PLACE_ORDER_IPG, {
		body: `SST=${SST}&sessionId=${sessionId}&ctoken=${csrfToken}`
	})
	.then(extractProp('redirectUrl'));
};
