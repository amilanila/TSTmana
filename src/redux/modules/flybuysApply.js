import { applyFlybuys } from '../../api/voucher';
import { feedbackError, feedbackDismiss } from './feedback';
import localeText from '../../helpers/locale-text';
import { analyticsEvent } from './analytics';

export const INIT_FLYBUYS = 'INIT_FLYBUYS';
export const APPLY_FLYBUYS_REQUEST = 'APPLY_FLYBUYS_REQUEST';
export const APPLY_FLYBUYS_SUCCESS = 'APPLY_FLYBUYS_SUCCESS';
export const APPLY_FLYBUYS_FAILURE = 'APPLY_FLYBUYS_FAILURE';

// Sync Actions
export const initFlybuys = code => ({
	type: INIT_FLYBUYS,
	payload: { code }
});
export const applyFlybuysRequest = (code) => ({
	type: APPLY_FLYBUYS_REQUEST,
	payload: { code },
	meta: {
		feedback: feedbackDismiss()
	}
});
export const applyFlybuysFailure = (err, message) => ({
	type: APPLY_FLYBUYS_FAILURE,
	payload: { error: err },
	meta: {
		feedback: feedbackError(message),
		track: analyticsEvent('flybuys Collect', 'invalid number')
	}
});
export const applyFlybuysSuccess = code => ({
	type: APPLY_FLYBUYS_SUCCESS,
	payload: { code	},
	meta: {
		track: analyticsEvent('flybuys Collect', 'valid number')
	}
});

const mapErrorCodeToLocaleText = errCode => {
	switch (errCode) {
	case 'ERR_FLYBUYS_INVALID':
		return localeText('invalid-flybuys');
	default:
		return localeText('api-error-flybuys');
	}
};

// Async Action
export const saveFlybuys = code => (dispatch, getState) => {
	dispatch(applyFlybuysRequest(code));
	applyFlybuys(code, getState().session.info.csrfToken)
		.then(
			data => dispatch(applyFlybuysSuccess(data)),
			err => {
				const errorText = mapErrorCodeToLocaleText(err.code);
				dispatch(applyFlybuysFailure(err, errorText));
			}
		)
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = {}, action) => {
	switch (action.type) {
	case INIT_FLYBUYS:
		return {
			isSaving: false,
			applied: 'successful',
			code: action.payload.code
		};
	case APPLY_FLYBUYS_REQUEST:
		return {
			isSaving: true
		};
	case APPLY_FLYBUYS_SUCCESS:
		return {
			isSaving: false,
			applied: 'successful',
			code: action.payload.code
		};
	case APPLY_FLYBUYS_FAILURE:
		return {
			isSaving: false,
			applied: 'rejected'
		};
	default:
		return state;
	}
};
