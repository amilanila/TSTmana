import { replaceWithLogin } from '../routes/navigate';

const GET_OPTIONS = {
	credentials: 'same-origin'
};

const POST_OPTIONS = {
	method: 'POST',
	credentials: 'same-origin',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	}
};

const createGuid = () => (Math.random() * 1e9).toFixed(0);

const status = response => {
	return response.status === 200 ?
		Promise.resolve(response) :
		Promise.reject(new Error(response.statusText));
};

const json = response => response.json();

const bustCache = url => `${url}?_=${+new Date()}`;

/*
 * Generic GET function wrapped around fetch
 */
export const get = (url, options) => {
	return fetch(bustCache(url), { ...GET_OPTIONS, ...options })
		.then(status)
		.then(json);
};

/*
 * Generic POST function wrapped around fetch
 */
export const post = (url, options) => {
	return fetch(bustCache(url), { ...POST_OPTIONS, ...options })
		.then(status)
		.then(json);
};

/*
 * Redirect to checkout login page if there is a login required api error
 */
export const validateSession = (data = {}) => {
	const { error } = data;
	if (error &&
		error.code === 'ERR_LOGIN_REQUIRED') {
		replaceWithLogin();
	}
};

/*
 * Resolve if success is true, and extract a prop if there is one
 * If there is no prop to extract, still resolve.
 */
export const confirmSuccess = () => res => {
	if (!res || !res.success) {
		// Check for ERR_LOGIN_REQUIRED
		validateSession(res.data);
		//  Not success or no data to extract, expect error
		return Promise.reject(res.error || (res.data && res.data.error) || 'unsuccessful');
	}
	return Promise.resolve(res.data);
};

/*
 * Extract a single property from the response json object by key
 * But only if success: true and it exists
 */
export const extractProp = prop => res => {
	if (!res ||
		!res.success ||
		!res.data ||
		!res.data.hasOwnProperty(prop)) {
		// Check for ERR_LOGIN_REQUIRED
		validateSession(res.data);
		//  Missing prop, expect error
		return Promise.reject(res.error || (res.data && res.data.error) || 'extract-prop-error');
	}
	return Promise.resolve(res.data[prop]);
};

/*
 * Extract a all the properties from the response json object.
 * But only if success: true
 */
export const extractAll = () => res => {
	if (!res ||
		!res.success ||
		!res.data) {
		// Check for ERR_LOGIN_REQUIRED
		validateSession(res.data);
		//  Not success or no data to extrat, expect error
		return Promise.reject(res.error || (res.data && res.data.error) || 'extract-prop-error');
	}
	return Promise.resolve(res.data);
};

/*
 * fetch API cannot be cancelled. This is an attempt to ensure that only
 * the most recent in-flight api call will fire a success. Any older in-flight
 * api calls will be "disregarded" (not cancelled)
 */
export const disregarder = api => {
	let guid;
	const check = cur => data => {
		return cur === guid ?
			Promise.resolve(data) :
			Promise.reject('disregarded');
	};
	return (...args) => {
		guid = createGuid();
		return api(...args).then(check(guid));
	};
};

/*
 * Take a payload and wrap it in a consistent way for passing to-be-rejected-
 * -promise down to redux-form. This is used when you want to use redux-forms
 * inline or form level validation.
 */
export function validationError(res) {
	return { validationError: res };
}

/*
 * Within a component, after a dispatch, if you want inline redux-form
 * validation to work, it needs to be a rejected promise. This does that if
 * you have a validation error object.
 */
export function passValidationErrorsToReduxForm(res) {
	return (res && res.validationError) ? Promise.reject(res.validationError) : res;
}
