import pick from 'lodash.pick';
import navigate from '../../routes/navigate';
import * as gtm from '../../helpers/gtm';
import { cartDetail } from '../../api/cart';
import { initDeliveryMode } from './selectedDeliveryMode';
import { initPickupDetails } from './pickupDetails';
import { initSearchStores } from './searchStores';
import { initSelectedAddress } from './selectedAddress';
import { initVoucher } from './voucher';
import { initTmd } from './teamMemberDiscount';
import { initCartSummary } from './cartSummary';
import { initFlybuys } from './flybuysApply';

export const FETCH_CARTDETAIL_REQUEST = 'FETCH_CARTDETAIL_REQUEST';
export const FETCH_CARTDETAIL_SUCCESS = 'FETCH_CARTDETAIL_SUCCESS';
export const FETCH_CARTDETAIL_FAILURE = 'FETCH_CARTDETAIL_FAILURE';

// Sync Actions
export const fetchCartDetailRequest = () => ({
	type: FETCH_CARTDETAIL_REQUEST
});
export const fetchCartDetailFailure = (err) => ({
	type: FETCH_CARTDETAIL_FAILURE,
	error: err
});
export const fetchCartDetailSuccess = () => ({
	type: FETCH_CARTDETAIL_SUCCESS
});

const delegateDetailsToOtherModules = (dispatch, detail) => {
	if (detail.deliveryMode) {
		dispatch(initDeliveryMode(detail.deliveryMode));
	}
	if (detail.store && detail.contact) {
		dispatch(initPickupDetails({
			store: detail.store,
			contact: detail.contact
		}));
	}
	// Init store for users who want to change CNC details.
	// So that the store is in the list.
	if (detail.store) {
		dispatch(initSearchStores([detail.store]));
	}
	if (detail.deliveryAddress) {
		dispatch(initSelectedAddress(detail.deliveryAddress));
	}
	if (detail.voucher) {
		dispatch(initVoucher(detail.voucher));
	}
	if (detail.tmdNumber) {
		dispatch(initTmd(detail.tmdNumber));
	}
	if (detail.flybuysCode) {
		dispatch(initFlybuys(detail.flybuysCode));
	}
	dispatch(
		initCartSummary(pick(detail,
			[
				'subtotal',
				'total',
				'deliveryFee',
				'entries',
				'voucher',
				'orderDiscounts',
				'gst',
				'containsDigitalEntriesOnly'
			]
		))
	);
	dispatch(fetchCartDetailSuccess());
	gtm.pushEvent('spc.cartLoaded', { tmid: detail.tmid });
};

// Async Action
export const fetchCartDetail = () => (dispatch) => {
	dispatch(fetchCartDetailRequest());
	cartDetail()
		.then(
			(detail = {}) => delegateDetailsToOtherModules(dispatch, detail),
			err => {
				if (err && err.code === 'ERR_CART_NO_ENTRIES') {
					navigate.redirectToBasket();
				} else {
					dispatch(fetchCartDetailFailure(err));
				}
			}
		)
		.catch(e => setTimeout(() => { throw e; }));
};
