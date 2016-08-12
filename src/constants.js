export const API_END_POINT = '/ws-api/v1/target';

export const Pages = {
	CHECKOUT: '/checkout',
	CHECKOUT_LOGIN: '/basket/checkout?spc=on',
	BASKET: '/basket'
};

export const Misc = {
	SESSION: '/session',
	ENV: '/env'
};

export const Delivery = {
	APPLICABLE_MODES: '/checkout/delivery/applicable-modes',
	SET_MODE: '/checkout/delivery/set-mode',
	SEARCH_STORES: '/checkout/delivery/stores/search',
	SET_PICKUP_DETAILS: '/checkout/delivery/stores/set-pickup-details',
	SAVED_ADDRESSESES: '/checkout/delivery/addresses',
	SET_ADDRESS: '/checkout/delivery/addresses/set-address',
	CREATE_ADDRESS: '/checkout/delivery/addresses/create',
	SEARCH_ADDRESS: '/checkout/delivery/addresses/search'
};

export const Cart = {
	DETAIL: '/checkout/cart/detail',
	SUMMARY: '/checkout/cart/summary'
};

export const Discount = {
	APPLY_VOUCHER: '/checkout/promotions/apply-voucher',
	REMOVE_VOUCHER: '/checkout/promotions/remove-voucher',
	APPLY_TMD: '/checkout/promotions/apply-tmd',
	APPLY_FLYBUYS: '/checkout/promotions/apply-flybuys'
};

export const Payment = {
	APPLICABLE_METHODS: '/checkout/payment/applicable-methods',
	SET_IPG_MODE: '/checkout/payment/set-ipg-mode',
	SET_PAYPAL_MODE: '/checkout/payment/set-paypal-mode',
	PLACE_ORDER_IPG: '/checkout/place-order/ipg'
};

export const PaymentMethods = {
	PAYPAL: 'paypal',
	IPG: 'ipg',
	GIFTCARD: 'giftcard'
};

export const Customer = {
	CHECK_REGISTRATION: '/checkout/login/guest',
	SIGN_IN: '/checkout/j_spring_security_check',
	REGISTER: '/checkout/login/register'
};

export const CmsAPI = {
	CONTENT: '/json-cms/tmana-content'
};

export const Billing = {
	COUNTRYLIST: '/checkout/billing/countries',
	SETADDRESS: '/checkout/billing/set-address'
};
