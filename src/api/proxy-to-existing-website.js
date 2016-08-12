import { Customer } from '../constants';

const POST_OPTIONS = {
	method: 'POST',
	credentials: 'same-origin',
	redirect: 'follow',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	}
};

function doFetch(url, options) {
	return fetch(url, { ...POST_OPTIONS, ...options });
}

function parseSuccess(response) {
	if (response.status === 500) {
		throw Error(response.statusText);
	}
	return response;
}

import { parseSignIn } from './proxy-sign-in';
import { parseRegistered } from './proxy-is-registered';

export function post(url, options) {
	function routeToHandler(...args) {
		if (url === Customer.CHECK_REGISTRATION) {
			return parseRegistered(...args);
		}

		return parseSignIn(...args);
	}

	return doFetch(url, options).then(parseSuccess).then(routeToHandler);
}
