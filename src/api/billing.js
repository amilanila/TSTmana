import URLSearchParams from 'url-search-params';
import { API_END_POINT, Billing } from '../constants';
import { extractProp, get, post } from './common';

export const getCountryList = () => {
	return get(API_END_POINT + Billing.COUNTRYLIST)
		.then(extractProp('countries'));
};

export const setAddress = (formData, csrfToken) => {
	if (!formData || !csrfToken) {
		return Promise.reject('Missing args');
	}
	const searchParams = new URLSearchParams(`ctoken=${csrfToken}`);
	Object.keys(formData).forEach(key => searchParams.append(key, formData[key]));
	return post(API_END_POINT + Billing.SETADDRESS, {
		body: searchParams.toString()
	})
		.then(extractProp('billingAddress'));
};
