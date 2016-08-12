import * as lib from '../../helpers/tracking';
import * as actions from '../modules/analytics';

const created = {};

const create = (env) => {
	// Ensure that ga is created;
	if (env && env.gaId && !created[env.gaId]) {
		created[env.gaId] = true;
		lib.create(env.gaId);
	}
};

const trackHandler = (action) => {
	switch (action.type) {
	case actions.ANALYTICS_EVENT:
		lib.trackEvent(action.payload);
		break;
	case actions.ANALYTICS_CHECKOUT_STEP:
		lib.setCheckoutStep(action.payload);
		lib.trackEvent({ action: 'Step', label: action.payload.step });
		break;
	case actions.ANALYTICS_CHECKOUT_OPTION:
		lib.setCheckoutOption(action.payload);
		lib.trackEvent({ action: 'Option' });
		break;
	default:
		break;
	}
};

const middleware = ({ getState }) => {
	return next => action => {
		next(action);

		const { track } = action.meta || {};

		if (track) {
			create(getState().env.info);
			trackHandler(track);
		}
	};
};

export default middleware;
