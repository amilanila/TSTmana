import { setAddress } from '../../api/delivery';
import localeText from '../../helpers/locale-text';
import { feedbackError, feedbackDismiss } from './feedback';
import { fetchDeliveryModes } from './deliveryModes';

export const INIT_SAVEDADDRESS = 'INIT_SAVEDADDRESS';
export const SAVE_ADDRESS_REQUEST = 'SAVE_ADDRESS_REQUEST';
export const SAVE_ADDRESS_SUCCESS = 'SAVE_ADDRESS_SUCCESS';
export const SAVE_ADDRESS_FAILURE = 'SAVE_ADDRESS_FAILURE';

// Sync Actions
export const initSelectedAddress = address => ({
	type: INIT_SAVEDADDRESS,
	payload: {
		address
	}
});
export const saveAddressRequest = (address, deliveryModeId) => ({
	type: SAVE_ADDRESS_REQUEST,
	payload: {
		address,
		deliveryModeId
	},
	meta: {
		feedback: feedbackDismiss()
	}
});
export const saveAddressFailure = (err, message) => ({
	type: SAVE_ADDRESS_FAILURE,
	payload: {
		error: err
	},
	meta: {
		feedback: feedbackError(message)
	}
});
export const saveAddressSuccess = ({ deliveryAddress, deliveryFeeChanged }) => ({
	type: SAVE_ADDRESS_SUCCESS,
	payload: {
		address: deliveryAddress
	},
	meta: {
		cart: { summaryForceUpdate: !!deliveryFeeChanged }
	}
});

export const selectCSRFToken = state =>
	state.session.info && state.session.info.csrfToken;

export const selectSelectedAddressId = state =>
	state.selectedAddress.address && state.selectedAddress.address.id;

// Async Action
export const saveAddress = (address, deliveryModeId) => (dispatch, getState) => {
	if (!address || !deliveryModeId) {
		throw Error('saveAddress missing required args');
	}
	dispatch(saveAddressRequest(address, deliveryModeId));
	setAddress(address.id, deliveryModeId, selectCSRFToken(getState()))
		.then(
				data => {
					if (selectSelectedAddressId(getState()) === address.id) {
						// Need to update the delivery modes to get all the new fees.
						if (data && data.deliveryFeeChanged) {
							dispatch(fetchDeliveryModes({ displayFeeChangedFeedback: data.deliveryFeeChanged }));
						}
						// The save address action has cart summary updates built in
						dispatch(saveAddressSuccess(data));
					}
				},
				err => dispatch(saveAddressFailure(err, localeText('api-error-saving')))
		)
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = {}, action) => {
	switch (action.type) {
	case SAVE_ADDRESS_REQUEST:
		return {
			isSaving: true,
			saveStatus: 'pending',
			address: action.payload.address,
			deliveryModeId: action.payload.deliveryModeId
		};
	case SAVE_ADDRESS_SUCCESS:
		return {
			isSaving: false,
			saveStatus: 'success',
			address: action.payload.address
		};
	case SAVE_ADDRESS_FAILURE:
		return {
			isSaving: false,
			saveStatus: 'failure'
		};
	case INIT_SAVEDADDRESS:
		return {
			isSaving: true,
			saveStatus: 'init',
			address: action.payload.address
		};
	default:
		return state;
	}
};
