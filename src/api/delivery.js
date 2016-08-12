import URLSearchParams from 'url-search-params';
import { API_END_POINT, Delivery } from '../constants';
import { extractProp, extractAll, get, post } from './common';

export const applicableModes = () => {
	return get(API_END_POINT + Delivery.APPLICABLE_MODES)
		.then(extractProp('deliveryModes'));
};

export const setMode = (deliveryMode, csrfToken) => {
	if (!deliveryMode || !csrfToken) {
		return Promise.reject('Missing args');
	}
	return post(API_END_POINT + Delivery.SET_MODE, {
		body: `id=${deliveryMode}&ctoken=${csrfToken}`
	})
	.then(extractProp('deliveryMode'));
};

export const searchStores = (locationText, csrfToken) => {
	if (!locationText || !csrfToken) {
		return Promise.reject('Missing args');
	}
	return post(API_END_POINT + Delivery.SEARCH_STORES, {
		body: `locationText=${locationText}&ctoken=${csrfToken}`
	}).then(extractProp('stores'));
};

export const setPickupDetails = (formData, csrfToken) => {
	if (!formData || !csrfToken) {
		return Promise.reject('Missing args');
	}
	const searchParams = new URLSearchParams(`ctoken=${csrfToken}`);
	Object.keys(formData).forEach(key => searchParams.append(key, formData[key]));
	return post(API_END_POINT + Delivery.SET_PICKUP_DETAILS, {
		body: searchParams.toString()
	}).then(extractAll());
};

export const getSavedAddresses = (deliveryMode) => {
	if (!deliveryMode) {
		return Promise.reject('Missing args');
	}
	return get(API_END_POINT + Delivery.SAVED_ADDRESSESES)
		.then(extractProp('deliveryAddresses'));
};

export const setAddress = (addressID, deliveryMode, csrfToken) => {
	if (!addressID || !deliveryMode || !csrfToken) {
		return Promise.reject('Missing args');
	}
	return post(API_END_POINT + Delivery.SET_ADDRESS, {
		body: `addressId=${addressID}&deliveryModeId=${deliveryMode}&ctoken=${csrfToken}`
	}).then(extractAll());
};

export const addAddress = (formData, csrfToken) => {
	if (!formData || !csrfToken) {
		return Promise.reject('Missing args');
	}
	const searchParams = new URLSearchParams(`ctoken=${csrfToken}`);
	Object.keys(formData).forEach(key => searchParams.append(
		key,
		!!formData[key] ? formData[key] : '')
	);
	return post(API_END_POINT + Delivery.CREATE_ADDRESS, {
		body: searchParams.toString()
	}).then(extractProp('createdAddress'));
};

export const searchAddress = (address, csrfToken) => {
	if (!address || !csrfToken) {
		return Promise.reject('Missing args');
	}
	return post(API_END_POINT + Delivery.SEARCH_ADDRESS, {
		body: `text=${address}&ctoken=${csrfToken}`
	}).then(extractProp('addressSuggestions'));
};
