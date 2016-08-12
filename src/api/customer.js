import URLSearchParams from 'url-search-params';
import { Customer } from '../constants';
import { commonPost, confirmSuccess } from './common';
import { post } from './proxy-to-existing-website';

export const checkIsCustomer = (email, csrfToken) => {
	if (!email || !csrfToken) {
		return Promise.reject('Missing args');
	}

	const body = `email=${email}&ctoken=${csrfToken}`;

	return post(Customer.CHECK_REGISTRATION, { body }).then(confirmSuccess());
};

export const signIn = (email, password) => {
	if (!email || !password) {
		return Promise.reject('Missing args');
	}

	const body = `j_username=${email}&j_password=${password}`;

	return post(Customer.SIGN_IN, { body }).then(confirmSuccess());
};

export const register = (formData, csrfToken) => {
	if (!formData || !csrfToken) {
		return Promise.reject('Missing args');
	}

	const searchParams = new URLSearchParams(`ctoken=${csrfToken}`);
	Object.keys(formData).forEach(key => searchParams.append(key, formData[key]));

	return commonPost(Customer.REGISTER, { body: searchParams.toString() });
};
