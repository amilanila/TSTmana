import { fetchCartSummary } from '../modules/cartSummary';

export default ({ dispatch }) => next => action => {
	next(action);
	const { cart = {} } = action.meta || {};

	if (process.env.NODE_ENV !== 'production') {
		Object.keys(cart).forEach(key => {
			if (key !== 'summaryForceUpdate') {
				/*eslint-disable*/
				console.error('cart-middleware doesnt support { meta.cart.' + key + ' }');
				/*eslint-enable*/
			}
		});
	}

	if (cart.summaryForceUpdate) {
		dispatch(fetchCartSummary());
	}
};
