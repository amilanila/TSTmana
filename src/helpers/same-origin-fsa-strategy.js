/*
 * Allow iframes to dispatch actions via postMessage to the redux store.
 * Expected data object;
 * 	{ csrfToken, fsa }
 */
import { isFSA } from 'flux-standard-action';
import { clearPaymentMethod } from '../redux/modules/selectedPaymentMethod';
import { ipgPlaceOrder } from '../redux/modules/placeOrderIpg';

const IPG_PAYMENT_CANCEL = 'IPG_PAYMENT_CANCEL';
const IPG_PAYMENT_ABORT = 'IPG_PAYMENT_ABORT';
const IPG_PAYMENT_COMPLETE = 'IPG_PAYMENT_COMPLETE';

const sameOrigin = origin => {
	const port = location.port ? `:${location.port}` : '';
	return origin === `${location.protocol}\/\/${location.hostname}${port}`;
};

const selectCSRFToken = state =>
	state.session && state.session.info && state.session.info.csrfToken;

/*
 * Actions received from inside the frame are mapped to actions within the application
 */
const mapMessageActionToAppAction = (state = {}, action) => {
	switch (action.type) {
	case IPG_PAYMENT_CANCEL:
		return clearPaymentMethod('cancel');
	case IPG_PAYMENT_ABORT:
		return clearPaymentMethod('abort');
	case IPG_PAYMENT_COMPLETE:
		return ipgPlaceOrder();
	default:
		return null;
	}
};

/*
 * The message handler that understands FSA's
 */
const createFSAMessageHandler = ({ dispatch, getState }) => event => {
	const { origin, data } = event;
	const state = getState();

	// This is a same origin strategy after all.
	if (!sameOrigin(origin)) {
		return;
	}

	const { fsa, csrfToken } = data || {};

	// We are checking the csrfToken because chrome extensions can postMessage with the
	// same window and same origin. Hard to distinguish.
	if (csrfToken !== selectCSRFToken(state)) {
		return;
	}

	// Ensure the intended action to be dispatched actually is a flux standard action.
	if (isFSA(fsa)) {
		const action = mapMessageActionToAppAction(state, fsa);
		if (action) {
			dispatch(action);
		}
	}
};

export default (store) => {
	if (typeof window !== 'undefined') {
		window.addEventListener('message', createFSAMessageHandler(store), false);
	}
};
