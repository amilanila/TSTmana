import localeText from '../../helpers/locale-text';
import { setPickupDetails } from '../../api/delivery';
import { feedbackError, feedbackDismiss } from './feedback';

export const INIT_PICKUPDETAILS = 'INIT_PICKUPDETAILS';
export const CHANGE_PICKUPDETAILS = 'CHANGE_PICKUPDETAILS';
export const SAVE_PICKUPDETAILS_REQUEST = 'SAVE_PICKUPDETAILS_REQUEST';
export const SAVE_PICKUPDETAILS_SUCCESS = 'SAVE_PICKUPDETAILS_SUCCESS';
export const SAVE_PICKUPDETAILS_FAILURE = 'SAVE_PICKUPDETAILS_FAILURE';

// Sync Actions
export const initPickupDetails = ({ store, contact }) => ({
	type: INIT_PICKUPDETAILS,
	payload: {
		store,
		contact
	}
});
export const savePickupDetailsRequest = (fieldValues) => ({
	type: SAVE_PICKUPDETAILS_REQUEST,
	payload: {
		fieldValues
	},
	meta: {
		feedback: feedbackDismiss()
	}
});
export const changePickupDetails = () => ({
	type: CHANGE_PICKUPDETAILS
});
export const savePickupDetailsFailure = (fieldValues, error, message) => ({
	type: SAVE_PICKUPDETAILS_FAILURE,
	payload: {
		fieldValues,
		error
	},
	meta: {
		feedback: feedbackError(message)
	}
});
export const savePickupDetailsSuccess = ({ store, contact }) => ({
	type: SAVE_PICKUPDETAILS_SUCCESS,
	payload: {
		store,
		contact
	}
});

// Async Action
export const savePickupDetails = (fieldValues) => (dispatch, getState) => {
	dispatch(savePickupDetailsRequest(fieldValues));
	setPickupDetails(fieldValues, getState().session.info.csrfToken)
		.then(
			data => dispatch(savePickupDetailsSuccess(data)),
			err => dispatch(savePickupDetailsFailure(fieldValues, err, localeText('api-error-saving')))
		)
		.catch(e => setTimeout(() => { throw e; }));
};

export const reducePickDetailsToFieldValues = ({ contact, store }) => {
	const { storeNumber } = store || {};
	return { storeNumber, ...contact };
};

// Reducer
export default (state = {}, action) => {
	switch (action.type) {
	case CHANGE_PICKUPDETAILS:
		return {
			saveInProgress: false,
			fieldValues: reducePickDetailsToFieldValues(state)
		};
	case SAVE_PICKUPDETAILS_REQUEST:
		return {
			saveInProgress: true,
			fieldValues: action.payload.fieldValues
		};
	case SAVE_PICKUPDETAILS_SUCCESS:
		return {
			saveInProgress: false,
			store: action.payload.store,
			contact: action.payload.contact
		};
	case SAVE_PICKUPDETAILS_FAILURE:
		return {
			saveInProgress: false,
			fieldValues: action.payload.fieldValues
		};
	case INIT_PICKUPDETAILS:
		return {
			saveInProgress: false,
			store: action.payload.store,
			contact: action.payload.contact
		};
	default:
		return state;
	}
};
