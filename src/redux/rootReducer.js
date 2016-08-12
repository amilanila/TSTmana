import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import staticRender from './modules/staticRender';
import env from './modules/env';
import session from './modules/session';
import feedback from './modules/feedback';
import cartSummary from './modules/cartSummary';
import deliveryModes from './modules/deliveryModes';
import selectedDeliveryMode from './modules/selectedDeliveryMode';
import searchStores from './modules/searchStores';
import pickupDetails from './modules/pickupDetails';
import savedAddresses from './modules/savedAddresses';
import selectedAddress from './modules/selectedAddress';
import createAddress from './modules/createAddress';
import voucher from './modules/voucher';
import teamMemberDiscount from './modules/teamMemberDiscount';
import paymentMethods from './modules/paymentMethods';
import suggestedAddresses from './modules/suggestedAddresses';
import selectedPaymentMethod from './modules/selectedPaymentMethod';
import flybuysApply from './modules/flybuysApply';
import registration from './modules/registration';
import authentication from './modules/authentication';
import cms from './modules/cms';
import placeOrderIpg from './modules/placeOrderIpg';
import countryList from './modules/countryList';
import billingAddress from './modules/billingAddress';

export default combineReducers({
	staticRender,
	env,
	form,
	session,
	feedback,
	cartSummary,
	deliveryModes,
	selectedDeliveryMode,
	searchStores,
	pickupDetails,
	savedAddresses,
	createAddress,
	selectedAddress,
	voucher,
	teamMemberDiscount,
	paymentMethods,
	suggestedAddresses,
	selectedPaymentMethod,
	flybuysApply,
	registration,
	authentication,
	cms,
	placeOrderIpg,
	countryList,
	billingAddress
});
