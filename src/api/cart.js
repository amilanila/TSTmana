import { API_END_POINT, Cart } from '../constants';
import { extractAll, get, disregarder } from './common';

export const cartDetail = disregarder(() => {
	return get(API_END_POINT + Cart.DETAIL)
		.then(extractAll());
});

export const cartSummary = disregarder(() => {
	return get(API_END_POINT + Cart.SUMMARY)
		.then(extractAll());
});
