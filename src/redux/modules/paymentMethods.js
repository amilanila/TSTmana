import { applicableMethods } from '../../api/payment';
import localeText from '../../helpers/locale-text';
import { feedbackError, feedbackDismiss } from './feedback';

export const FETCH_PAYMENTMETHODS_REQUEST = 'FETCH_PAYMENTMETHODS_REQUEST';
export const FETCH_PAYMENTMETHODS_SUCCESS = 'FETCH_PAYMENTMETHODS_SUCCESS';
export const FETCH_PAYMENTMETHODS_FAILURE = 'FETCH_PAYMENTMETHODS_FAILURE';

// Sync Actions
export const fetchPaymentMethodsRequest = () => ({
	type: FETCH_PAYMENTMETHODS_REQUEST,
	meta: {
		feedback: feedbackDismiss()
	}
});
export const fetchPaymentMethodsFailure = (err, message) => ({
	type: FETCH_PAYMENTMETHODS_FAILURE,
	payload: {
		error: err
	},
	meta: {
		feedback: feedbackError(message)
	}
});
export const fetchPaymentMethodsSuccess = paymentMethods => ({
	type: FETCH_PAYMENTMETHODS_SUCCESS,
	payload: {
		paymentMethods
	}
});

// Async Action
export const fetchPaymentMethods = () => dispatch => {
	dispatch(fetchPaymentMethodsRequest());
	applicableMethods()
		.then(
			paymentMethods => dispatch(fetchPaymentMethodsSuccess(paymentMethods)),
			err => dispatch(fetchPaymentMethodsFailure(err, localeText('api-error-payment')))
		)
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = { list: [] }, action) => {
	switch (action.type) {
	case FETCH_PAYMENTMETHODS_REQUEST:
		return {
			isFetching: true,
			list: []
		};
	case FETCH_PAYMENTMETHODS_SUCCESS:
		return {
			isFetching: false,
			list: [...action.payload.paymentMethods]
		};
	case FETCH_PAYMENTMETHODS_FAILURE:
		return {
			isFetching: false,
			list: []
		};
	default:
		return state;
	}
};
