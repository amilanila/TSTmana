const tryAgain = 'Please try again.';
const error = 'There was an error';

const local = {
	'api-error': `${error} getting your details. ${tryAgain}`,
	'api-error-billing': `${error} saving your billing address. ${tryAgain}`,
	'api-error-delivery-info': `${error} getting your delivery information. ${tryAgain}`,
	'api-error-delivery': `${error} getting your delivery options. ${tryAgain}`,
	'api-error-stores': `${error} getting the closest stores. ${tryAgain}`,
	'api-error-saving': `${error} saving your details. ${tryAgain}`,
	'api-error-tmd': `${error} applying the team member discount. ${tryAgain}`,
	'api-error-promo': `${error} applying the promotional code. ${tryAgain}`,
	'api-error-place-order': `${error} processing your payment. ${tryAgain}`,
	'api-error-payment-save': `${error} saving your payment method. ${tryAgain}`,
	'api-error-flybuys': `${error} verifying the flybuys number. ${tryAgain}`,
	'email-invalid': `Email must be in a valid format. ${tryAgain}`,
	'place-order-payment-failure': `We couldn&#8217;t take payment using the card details` +
		` provided. For security reasons please re-supply your details and try again.`,
	'place-order-cart-changes': `Changes have been made to your basket. ` +
		`Please provide your card details to continue`,
	'place-order-gift-card-used': `Gift cards cannot be used to purchase gift cards. ` +
		`Please select another payment option.`,
	'place-order-missing-delivery': `Your order does not have complete Delivery details. ` +
		`Please fix and try again.`,
	'place-order-missing-billing': `Your order does not have complete Billing address. ` +
		`Please fix and try again.`,
	'place-order-soh': `Our stock levels changed while you were shopping. ` +
		`Please review your basket. You will not be charged for removed items.`,
	'invalid-tmd': `We don&#8217;t recognise that team member card number. ` +
		`Please check and re-submit`,
	'invalid-flybuys': `We don&#8217;t recognise that flybuys card number. ` +
		`Please check and re-submit`,
	'voucher-conditions': `Your basket doesn&#8217;t meet the conditions ` +
		`for the promo code. We recommend checking the conditions and trying again`,
	'voucher-does-not-exist': `We couldn&#8217;t find that promo code. ` +
		`Please check and re-submit.`,
	'voucher-remove-failure': `${error} saving your details. ${tryAgain}`,
	'api-error-payment': `${error} getting payment methods. ${tryAgain}`,
	'suggested-unavailable': `${error} with address search. Please try again or use the full form`,
	'delivery-fee-changed': `Your delivery fee has updated based on your new postcode`,
	'paypal-unavailable': `${error} going to PayPal. ${tryAgain}`,
	'login-failed': `Your username or password was incorrect.`,
	'locked-account': `Due to excessive failed login attempts, your account has been locked.`
};

export default key => local[key] ?
	local[key].replace(/\&\#(\d+);/g, (val, match) => {
		return String.fromCharCode(match);
	}) : '';
