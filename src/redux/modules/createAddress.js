import { addAddress } from '../../api/delivery';
import { fetchSavedAddresses } from './savedAddresses';
import { saveAddress } from './selectedAddress';
import { clearSuggestedAddresses } from './suggestedAddresses';
import { feedbackError, feedbackDismiss } from './feedback';
import localeText from '../../helpers/locale-text';

export const CREATE_ADDRESS_REQUEST = 'CREATE_ADDRESS_REQUEST';
export const CREATE_ADDRESS_SUCCESS = 'CREATE_ADDRESS_SUCCESS';
export const CREATE_ADDRESS_FAILURE = 'CREATE_ADDRESS_FAILURE';

// Sync Actions

export const createAddressRequest = (formData) => ({
	type: CREATE_ADDRESS_REQUEST,
	payload: {
		formData
	},
	meta: {
		feedback: feedbackDismiss()
	}
});
export const createAddressFailure = (err, message) => ({
	type: CREATE_ADDRESS_FAILURE,
	payload: {
		error: err
	},
	meta: {
		feedback: feedbackError(message)
	}
});
export const createAddressSuccess = addressId => ({
	type: CREATE_ADDRESS_SUCCESS,
	payload: {
		addressId
	}
});

export const selectCSRFToken = state =>
	state.session.info && state.session.info.csrfToken;

export const selectDelModeId = state =>
	state.selectedDeliveryMode && state.selectedDeliveryMode.mode.id;

// Async Action

export const fetchAddressAndSave = data => (dispatch, getState) => {
	if (selectDelModeId(getState())) {
		dispatch(saveAddress({ id: data.id }, selectDelModeId(getState())));
		dispatch(fetchSavedAddresses(selectDelModeId(getState())));
	}
	dispatch(clearSuggestedAddresses());
};

export const createAddress = (formData) => (dispatch, getState) => {
	if (!formData) {
		throw Error('createAddress missing required args');
	}
	dispatch(createAddressRequest(formData));
	addAddress(formData, selectCSRFToken(getState()))
		.then(data => {
			dispatch(createAddressSuccess(data));
			dispatch(fetchAddressAndSave(data));
		},
			err => dispatch(createAddressFailure(err, localeText('api-error-saving')))
		)
		.catch(e => setTimeout(() => { throw e; }));
};

// Reducer
export default (state = {}, action) => {
	switch (action.type) {
	case CREATE_ADDRESS_REQUEST:
		return {
			isSaving: true,
			saveStatus: 'pending',
			formData: action.payload.formData
		};
	case CREATE_ADDRESS_SUCCESS:
		return {
			isSaving: false,
			saveStatus: 'success',
			addressId: action.payload.addressId
		};
	case CREATE_ADDRESS_FAILURE:
		return {
			isSaving: false,
			saveStatus: 'failure'
		};
	default:
		return state;
	}
};
