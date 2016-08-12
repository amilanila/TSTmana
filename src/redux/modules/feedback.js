export const FEEDBACK_WARNING = 'FEEDBACK_WARNING';
export const FEEDBACK_ERROR = 'FEEDBACK_ERROR';
export const FEEDBACK_SUCCESS = 'FEEDBACK_SUCCESS';
export const FEEDBACK_INFORMATION = 'FEEDBACK_INFORMATION';
export const FEEDBACK_DISMISS = 'FEEDBACK_DISMISS';

// Sync Actions
export const feedbackWarning = message => ({
	type: FEEDBACK_WARNING,
	payload: {
		message
	}
});
export const feedbackError = message => ({
	type: FEEDBACK_ERROR,
	payload: {
		message
	}
});
export const feedbackSuccess = message => ({
	type: FEEDBACK_SUCCESS,
	payload: {
		message
	}
});
export const feedbackInformation = message => ({
	type: FEEDBACK_INFORMATION,
	payload: {
		message
	}
});
export const feedbackDismiss = () => ({
	type: FEEDBACK_DISMISS
});

// Reducer
export default (state = {}, action) => {
	switch (action.type) {
	case FEEDBACK_WARNING:
		return {
			type: 'warning',
			message: action.payload.message
		};
	case FEEDBACK_ERROR:
		return {
			type: 'error',
			message: action.payload.message
		};
	case FEEDBACK_SUCCESS:
		return {
			type: 'success',
			message: action.payload.message
		};
	case FEEDBACK_INFORMATION:
		return {
			type: 'info',
			message: action.payload.message
		};
	case FEEDBACK_DISMISS:
		return {};
	default:
		return state;
	}
};
