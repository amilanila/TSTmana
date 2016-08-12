import { applicableModes } from '../../api/delivery';
import { analyticsCheckoutStep } from './analytics';
import localeText from '../../helpers/locale-text';
import { feedbackError, feedbackDismiss, feedbackInformation } from './feedback';

export const FETCH_DELIVERYMODES_REQUEST = 'FETCH_DELIVERYMODES_REQUEST';
export const FETCH_DELIVERYMODES_SUCCESS = 'FETCH_DELIVERYMODES_SUCCESS';
export const FETCH_DELIVERYMODES_FAILURE = 'FETCH_DELIVERYMODES_FAILURE';

// Sync Actions
export const fetchDeliveryModesRequest = () => ({
	type: FETCH_DELIVERYMODES_REQUEST,
	meta: {
		feedback: feedbackDismiss()
	}
});
export const fetchDeliveryModesFailure = (err, message) => ({
	type: FETCH_DELIVERYMODES_FAILURE,
	payload: {
		error: err
	},
	meta: {
		feedback: feedbackError(message)
	}
});
export const fetchDeliveryModesSuccess = (deliveryModes, displayFeeChangedFeedback) => ({
	type: FETCH_DELIVERYMODES_SUCCESS,
	payload: {
		deliveryModes
	},
	meta: {
		track: analyticsCheckoutStep(2),
		feedback: !!displayFeeChangedFeedback && feedbackInformation(localeText('delivery-fee-changed'))
	}
});

// Async Action
export const fetchDeliveryModes = (displayFeeChangedFeedback) => dispatch => {
	dispatch(fetchDeliveryModesRequest());
	applicableModes()
		.then(
			deliveryModes => dispatch(
				fetchDeliveryModesSuccess(deliveryModes, displayFeeChangedFeedback)
			),
			err => dispatch(fetchDeliveryModesFailure(err, localeText('api-error-delivery')))
		)
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = { list: [] }, action) => {
	switch (action.type) {
	case FETCH_DELIVERYMODES_REQUEST:
		return {
			isFetching: true,
			fetchStatus: 'pending',
			list: [...state.list]
		};
	case FETCH_DELIVERYMODES_SUCCESS:
		return {
			isFetching: false,
			fetchStatus: 'success',
			list: [...action.payload.deliveryModes]
		};
	case FETCH_DELIVERYMODES_FAILURE:
		return {
			isFetching: false,
			fetchStatus: 'failure',
			list: []
		};
	default:
		return state;
	}
};
