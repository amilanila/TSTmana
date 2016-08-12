import { cartSummary } from '../../api/cart';
import { decode } from 'html-entities/lib/html5-entities';
import navigate from '../../routes/navigate';

export const INIT_CARTSUMMARY = 'INIT_CARTSUMMARY';
export const FETCH_CARTSUMMARY_REQUEST = 'FETCH_CARTSUMMARY_REQUEST';
export const FETCH_CARTSUMMARY_SUCCESS = 'FETCH_CARTSUMMARY_SUCCESS';
export const FETCH_CARTSUMMARY_FAILURE = 'FETCH_CARTSUMMARY_FAILURE';

export const initCartSummary = (
	{
		subtotal,
		deliveryFee,
		total,
		entries,
		voucher,
		orderDiscounts,
		gst,
		containsDigitalEntriesOnly
	}
) => ({
	type: INIT_CARTSUMMARY,
	payload: {
		subtotal,
		deliveryFee,
		total,
		entries,
		orderDiscounts,
		voucher,
		gst,
		containsDigitalEntriesOnly
	}
});
export const fetchCartSummaryRequest = () => ({
	type: FETCH_CARTSUMMARY_REQUEST
});
export const fetchCartSummaryFailure = (error) => ({
	type: FETCH_CARTSUMMARY_FAILURE,
	payload: {
		error
	}
});
export const fetchCartSummarySuccess = (
	{
		subtotal,
		deliveryFee,
		total,
		entries,
		voucher,
		orderDiscounts,
		gst
	}
) => ({
	type: FETCH_CARTSUMMARY_SUCCESS,
	payload: {
		subtotal,
		deliveryFee,
		total,
		entries,
		orderDiscounts,
		voucher,
		gst
	}
});

// Async Action
export const fetchCartSummary = () => (dispatch) => {
	dispatch(fetchCartSummaryRequest());
	cartSummary()
		.then(
			data => dispatch(fetchCartSummarySuccess(data)),
			err => {
				if (err && err.code === 'ERR_CART_NO_ENTRIES') {
					navigate.redirectToBasket();
				} else if (err !== 'disregarded') {
					dispatch(fetchCartSummaryFailure(err));
				}
			}
		)
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = {}, action) => {
	const {
		subtotal,
		deliveryFee,
		total,
		entries = [],
		orderDiscounts,
		voucher,
		gst,
		containsDigitalEntriesOnly
	} = action.payload || {};
	const decodedEntries = entries.map(entry => {
		const { product: { name, ...productDetails } = {}, ...additionalInfo } = entry;
		const newName = decode(name || '');
		return { product: { name: newName, ...productDetails }, ...additionalInfo };
	});

	const summary = {
		subtotal,
		deliveryFee,
		total,
		entries: decodedEntries,
		voucher,
		orderDiscounts,
		gst,
		containsDigitalEntriesOnly
	};
	switch (action.type) {
	case INIT_CARTSUMMARY:
		return { isFetching: false, ...summary };
	case FETCH_CARTSUMMARY_REQUEST:
		return { isFetching: true, ...state };
	case FETCH_CARTSUMMARY_SUCCESS:
		return { isFetching: false, ...summary };
	case FETCH_CARTSUMMARY_FAILURE:
		return { isFetching: false };
	default:
		return state;
	}
};
