import localeText from '../../helpers/locale-text';
import { setMode } from '../../api/delivery';
import { analyticsCheckoutOption } from './analytics';
import { feedbackError, feedbackDismiss } from './feedback';

export const INIT_DELIVERYMODE = 'INIT_DELIVERYMODE';
export const SAVE_DELIVERYMODE_REQUEST = 'SAVE_DELIVERYMODE_REQUEST';
export const SAVE_DELIVERYMODE_SUCCESS = 'SAVE_DELIVERYMODE_SUCCESS';
export const SAVE_DELIVERYMODE_FAILURE = 'SAVE_DELIVERYMODE_FAILURE';

// Sync Actions
export const initDeliveryMode = deliveryMode => ({
	type: INIT_DELIVERYMODE,
	payload: {
		deliveryMode
	}
});
export const saveDeliveryModeRequest = intendedMode => ({
	type: SAVE_DELIVERYMODE_REQUEST,
	payload: {
		intendedMode
	},
	meta: {
		feedback: feedbackDismiss()
	}
});
export const saveDeliveryModeFailure = (err, message) => ({
	type: SAVE_DELIVERYMODE_FAILURE,
	payload: {
		error: err
	},
	meta: {
		feedback: feedbackError(message)
	}
});
export const saveDeliveryModeSuccess = deliveryMode => ({
	type: SAVE_DELIVERYMODE_SUCCESS,
	payload: {
		deliveryMode
	},
	meta: {
		cart: { summaryForceUpdate: true },
		track: analyticsCheckoutOption(2, deliveryMode.id)
	}
});

const selectCSRFToken = state =>
	state.session.info && state.session.info.csrfToken;

const selectSelectedDeliveryModeId = state =>
	state.selectedDeliveryMode.mode && state.selectedDeliveryMode.mode.id;

// Async Action
export const saveDeliveryMode = (intendedMode) => (dispatch, getState) => {
	dispatch(saveDeliveryModeRequest(intendedMode));
	setMode(intendedMode, selectCSRFToken(getState()))
		.then(
			mode => {
				// Ignore success unless same as intended
				if (selectSelectedDeliveryModeId(getState()) === intendedMode) {
					dispatch(saveDeliveryModeSuccess(mode));
				}
			},
			err => {
				dispatch(saveDeliveryModeFailure(err, localeText('api-error-saving')));
			}
		)
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = {}, action) => {
	switch (action.type) {
	case SAVE_DELIVERYMODE_REQUEST:
		return {
			isSaving: true,
			saveStatus: 'pending',
			mode: { id: action.payload.intendedMode }
		};
	case SAVE_DELIVERYMODE_SUCCESS:
		return {
			isSaving: false,
			saveStatus: 'success',
			mode: action.payload.deliveryMode
		};
	case SAVE_DELIVERYMODE_FAILURE:
		return {
			isSaving: false,
			saveStatus: 'failure'
		};
	case INIT_DELIVERYMODE:
		return {
			isSaving: false,
			saveStatus: 'init',
			mode: action.payload.deliveryMode
		};
	default:
		return state;
	}
};
