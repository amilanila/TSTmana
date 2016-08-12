import memoize from 'lodash.memoize';

// RegExp
const RE_NAME = /^(?!\D*\d+\D*$)\s*(\w+((-|'|\s)\w+)*)\s*$/;
const RE_MOBILE_PHONE = /^\s*?\(?\+?(61|610|0)?\)?[45]\)?[- \d]*$/;
const RE_PHONE = /^\s*?\+?[- \(\)\d]*$/;
const RE_ADDRESS = /^[A-Za-z\d\s-\'/]*$/;
const RE_TOWN = /^\s*([A-Za-z|\s])+\s*$/;
const RE_POSTCODE = /^\s*([\d]{4})\s*$/;
const RE_FLYBUYS = /^\s*([\d]{16})\s*$/;

import { EMAIL_VALIDATOR as RE_EMAIL } from './email-validation';

// Locale
const textRequired = field => `What is your ${field}?`;
const selectRequired = (field, connector = 'a') => `Please select ${connector} ${field}.`;
const textLength = (field, min, max, things, connector = 'a') =>
	`Please enter ${connector} ${field} between ${min} and ${max} ${things}.`;
const digitLength = (field, limit, connector = 'a') =>
	`Please enter ${connector} ${field} with ${limit} digits.`;
const textInvalid = (field) =>
	`Please enter a valid ${field}.`;

const trim = value => {
	return (typeof value !== 'string' ? String(value) : value).trim();
};

// Valid Helpers
const validRequired = (field, options = {}) => (value = '') => {
	if (!trim(value)) {
		return options.selectable ? selectRequired(field, options.connector) : textRequired(field);
	}
};

const validGeneric = (field, min, max) => (value = '') => {
	if (!trim(value)) {
		return textRequired(field);
	} else if (value.length < min || value.length > max) {
		return textLength(field, min, max, 'characters');
	}
};

const validName = (field, min, max) => (value = '') => {
	if (!trim(value)) {
		return textRequired(field);
	} else if (value.length < min || value.length > max) {
		return textLength(field, min, max, 'characters');
	} else if (!RE_NAME.test(value)) {
		return textInvalid(field);
	}
};

export const validMobile = (field, min, max) => (value = '') => {
	if (!trim(value)) {
		return textRequired(field);
	} else if (value.length < min || value.length > max) {
		return textLength(field, min, max, 'digits');
	} else if (!RE_MOBILE_PHONE.test(value)) {
		return textInvalid(field);
	}
};

export const validAddress = (field, min, max, options = {}) => (value = '') => {
	if (options.isRequired || trim(value)) {
		if (!trim(value)) {
			return textRequired(field);
		} else if (value.length < min || value.length > max) {
			return textLength(field, min, max, 'characters', 'an');
		} else if (!RE_ADDRESS.test(value)) {
			return textInvalid(field);
		}
	}
};

export const validTown = (field, min, max) => (value = '') => {
	if (!trim(value)) {
		return textRequired(field);
	} else if (value.length < min || value.length > max) {
		return textLength(field, min, max, 'letters');
	} else if (!RE_TOWN.test(value)) {
		return textInvalid(field);
	}
};

export const validPostcode = (field, min, max) => (value = '') => {
	if (!trim(value)) {
		return textRequired(field);
	} else if (value.length < min || value.length > max || !RE_POSTCODE.test(value)) {
		return digitLength(field, max);
	}
};

export const validPhone = (field, min, max) => (value = '') => {
	if (!trim(value)) {
		return textRequired(field);
	} else if (value.length < min || value.length > max) {
		return textLength(field, min, max, 'digits');
	} else if (!RE_PHONE.test(value)) {
		return textInvalid(field);
	}
};

export const validFlybuys = field => (value = '') => {
	if (value.length && !RE_FLYBUYS.test(value)) {
		return textInvalid(field);
	}
};

export const validEmail = field => (value = '') => {
	if (!trim(value)) {
		return textRequired(field);
	} else if (!RE_EMAIL.test(value)) {
		return textInvalid(field);
	}
};

// Predefined field types
export const title = memoize(validRequired('title'));
export const firstName = memoize(validName('first name', 2, 32));
export const lastName = memoize(validName('last name', 2, 32));
export const mobileNumber = memoize(validMobile('mobile number', 10, 16));
export const storeNumber = memoize(validRequired('store', { selectable: true }));
export const search = memoize(validGeneric('location', 1, 32));
export const line1 = memoize(validAddress('address line 1', 2, 40, { isRequired: true }));
export const line2 = memoize(validAddress('address line 2', 2, 40, { isRequired: false }));
export const town = memoize(validTown('city/suburb', 1, 64));
export const state = memoize(validRequired('state'));
export const postalCode = memoize(validPostcode('postcode', 1, 4));
export const phone = memoize(validPhone('phone number', 9, 16));
export const singleLineId = memoize(validRequired('address'));
export const singleLineLabel =
	memoize(validRequired('address', { selectable: true, connector: 'an' }));
export const email = memoize(validEmail('email'));
export const password = memoize(validRequired('password'));
