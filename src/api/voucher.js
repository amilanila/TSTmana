import { API_END_POINT, Discount } from '../constants';
import { extractProp, post, confirmSuccess } from './common';

// Apply promo voucher
export const applyVoucher = (code, csrfToken) => {
	if (!code || !csrfToken) {
		return Promise.reject('Missing args');
	}

	return post(API_END_POINT + Discount.APPLY_VOUCHER, {
		body: `code=${code}&ctoken=${csrfToken}`
	}).then(extractProp('voucher'));
};

export const removeVoucher = (csrfToken) => {
	if (!csrfToken) {
		return Promise.reject('Missing args');
	}

	return post(API_END_POINT + Discount.REMOVE_VOUCHER, {
		body: `ctoken=${csrfToken}`
	}).then(confirmSuccess());
};

export const applyTmd = (tmdNumber, csrfToken) => {
	if (!tmdNumber || !csrfToken) {
		return Promise.reject('Missing args');
	}

	return post(API_END_POINT + Discount.APPLY_TMD, {
		body: `code=${tmdNumber}&ctoken=${csrfToken}`
	}).then(extractProp('tmdNumber'));
};

export const applyFlybuys = (flybuysCode, csrfToken) => {
	if (!flybuysCode || !csrfToken) {
		return Promise.reject('Missing args');
	}

	return post(API_END_POINT + Discount.APPLY_FLYBUYS, {
		body: `code=${flybuysCode}&ctoken=${csrfToken}`
	}).then(extractProp('flybuysCode'));
};
