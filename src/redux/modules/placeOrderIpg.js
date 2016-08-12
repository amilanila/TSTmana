import { placeOrderIpg } from '../../api/payment';
import { clearPaymentMethod } from './selectedPaymentMethod';
import { setLocationHref } from '../../helpers/browser';
import navigate from '../../routes/navigate';
import { feedbackDismiss, feedbackError } from './feedback';
import localeText from '../../helpers/locale-text';

export const IPG_PLACEORDER_REQUEST = 'IPG_PLACEORDER_REQUEST';
export const IPG_PLACEORDER_SUCCESS = 'IPG_PLACEORDER_SUCCESS';
export const IPG_PLACEORDER_FAILURE = 'IPG_PLACEORDER_FAILURE';

const mapErrorCodeToLocaleText = (code) => {
	switch (code) {
	case 'ERR_PLACEORDER_INSUFFICIENT_STOCK':
		return localeText('place-order-soh');
	case 'ERR_PLACEORDER_PAYMENT_FAILURE':
		return localeText('place-order-payment-failure');
	case 'ERR_PLACEORDER_PAYMENT_FAILURE_DUETO_MISSMATCH_TOTALS':
		return localeText('place-order-cart-changes');
	case 'ERR_PLACEORDER_INCOMPLETE_DELIVERY_INFO':
		return localeText('place-order-missing-delivery');
	case 'ERR_PLACEORDER_INCOMPLETE_BILLING_ADDRESS':
		return localeText('place-order-missing-billing');
	case 'ERR_PLACEORDER_GIFTCARD_PAYMENT_NOT_ALLOWED':
		return localeText('place-order-gift-card-used');
	default:
		return localeText('api-error-place-order');
	}
};


// Sync Actions
export const ipgPlaceOrderRequest = () => ({
	type: IPG_PLACEORDER_REQUEST,
	meta: {
		feedback: feedbackDismiss()
	}
});
export const ipgPlaceOrderFailure = (err) => ({
	type: IPG_PLACEORDER_FAILURE,
	payload: {
		error: err
	},
	meta: {
		feedback: feedbackError(mapErrorCodeToLocaleText(err.code))
	}
});
export const ipgPlaceOrderSuccess = redirectUrl => ({
	type: IPG_PLACEORDER_SUCCESS,
	payload: {
		redirectUrl
	}
});

const selectIpgPaymentMethod = state => {
	const { method = {} } = state.selectedPaymentMethod || {};
	return method.ipg ? method : {};
};

// Async Action
export const ipgPlaceOrder = () => (dispatch, getState) => {
	const state = getState();

	// The users needs to see the place order transition page before we try to place the order
	dispatch(ipgPlaceOrderRequest());
	navigate.replaceWithPlaceOrder();

	// Gather tokens/sessions and attempt the place the order
	const { SST, sessionId } = selectIpgPaymentMethod(state);
	placeOrderIpg(SST, sessionId, state.session.info.csrfToken)
		.then(
			redirectUrl => {
				dispatch(ipgPlaceOrderSuccess(redirectUrl));
				// Dispatching this action will redirect the browser to the thank you page
				setLocationHref(redirectUrl);
			},
			err => {
				// Go back to the checkout
				navigate.replaceWithCheckout();
				// Reset the payment method, getting rid of iframe.
				dispatch(clearPaymentMethod());
				// Time to let the user know
				dispatch(ipgPlaceOrderFailure(err));
			}
		)
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = {}, action) => {
	switch (action.type) {
	case IPG_PLACEORDER_REQUEST:
		return {
			...state,
			isPlacing: true
		};
	case IPG_PLACEORDER_SUCCESS:
		return {
			isPlacing: false,
			orderPlaced: true,
			redirectUrl: action.payload.redirectUrl
		};
	case IPG_PLACEORDER_FAILURE:
		return {
			isPlacing: false,
			orderPlaced: false,
			error: action.payload.error
		};
	default:
		return state;
	}
};
