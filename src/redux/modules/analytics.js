export const ANALYTICS_EVENT = 'ANALYTICS_EVENT';
export const ANALYTICS_CHECKOUT_STEP = 'ANALYTICS_CHECKOUT_STEP';
export const ANALYTICS_CHECKOUT_OPTION = 'ANALYTICS_CHECKOUT_OPTION';

// Actions
export const analyticsEvent = (action, label) => ({
	type: ANALYTICS_EVENT,
	payload: {
		category: 'SPC',
		action,
		label
	}
});

export const analyticsCheckoutStep = (step, option) => ({
	type: ANALYTICS_CHECKOUT_STEP,
	payload: { step, option }
});

export const analyticsCheckoutOption = (step, option) => ({
	type: ANALYTICS_CHECKOUT_OPTION,
	payload: { step, option }
});

// Reducer (Noop)
export default (state) => state;
