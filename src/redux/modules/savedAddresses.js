import { getSavedAddresses } from '../../api/delivery';
import localeText from '../../helpers/locale-text';
import { feedbackError, feedbackDismiss } from './feedback';

export const NEW_ADDRESS = 'NEW_ADDRESS';
export const FETCH_SAVEDADDRESS_REQUEST = 'FETCH_SAVEDADDRESS_REQUEST';
export const FETCH_SAVEDADDRESS_SUCCESS = 'FETCH_SAVEDADDRESS_SUCCESS';
export const FETCH_SAVEDADDRESS_FAILURE = 'FETCH_SAVEDADDRESS_FAILURE';

// Sync Actions
export const newAddress = () => ({
	type: NEW_ADDRESS
});
export const fetchSavedAddressRequest = deliveryMode => ({
	type: FETCH_SAVEDADDRESS_REQUEST,
	payload: {
		deliveryMode
	},
	meta: {
		feedback: feedbackDismiss()
	}
});
export const fetchSavedAddressFailure = (err, message) => ({
	type: FETCH_SAVEDADDRESS_FAILURE,
	payload: {
		error: err
	},
	meta: {
		feedback: feedbackError(message)
	}
});
export const fetchSavedAddressSuccess = savedAddresses => ({
	type: FETCH_SAVEDADDRESS_SUCCESS,
	payload: {
		savedAddresses
	}
});

// Async Action
export const fetchSavedAddresses = mode => dispatch => {
	if (!mode) {
		throw Error('fetchSavedAddresses missing required args');
	}

	dispatch(fetchSavedAddressRequest(mode));
	getSavedAddresses(mode)
		.then(
			savedAddresses => dispatch(fetchSavedAddressSuccess(savedAddresses)),
			err => dispatch(fetchSavedAddressFailure(err, localeText('api-error-delivery-info')))
		)
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = { list: [] }, action) => {
	switch (action.type) {
	case NEW_ADDRESS:
		return {
			showAddressForm: true,
			isFetching: false,
			list: state.list
		};
	case FETCH_SAVEDADDRESS_REQUEST:
		return {
			showAddressForm: false,
			isFetching: true,
			list: []
		};
	case FETCH_SAVEDADDRESS_SUCCESS:
		return {
			showAddressForm: false,
			isFetching: false,
			list: [...action.payload.savedAddresses]
		};
	case FETCH_SAVEDADDRESS_FAILURE:
		return {
			showAddressForm: false,
			isFetching: false,
			list: []
		};
	default:
		return state;
	}
};
