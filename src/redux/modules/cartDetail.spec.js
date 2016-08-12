import deepfreeze from 'deep-freeze';

describe('cartDetail', () => {
	let actions;
	let inits;
	let api;
	let pushEvent;
	let navigate;

	beforeEach(() => {
		const gtm = jasmine.createSpyObj('gtm', ['pushEvent']);
		api = jasmine.createSpyObj('api', ['cartDetail']);
		navigate = jasmine.createSpyObj('navigate', ['redirectToBasket']);
		inits = jasmine.createSpyObj('actions',
			[
				'initDeliveryMode',
				'initPickupDetails',
				'initSearchStores',
				'initSelectedAddress',
				'initVoucher',
				'initTmd',
				'initFlybuys',
				'initCartSummary'
			]
		);
		actions = require('inject!./cartDetail')({
			'../../api/cart': api,
			'../../helpers/gtm': gtm,
			'../../routes/navigate': navigate,
			'./selectedDeliveryMode': inits,
			'./pickupDetails': inits,
			'./searchStores': inits,
			'./selectedAddress': inits,
			'./voucher': inits,
			'./teamMemberDiscount': inits,
			'./cartSummary': inits,
			'./flybuysApply': inits
		});
		pushEvent = gtm.pushEvent;
	});

	describe('sync actions', () => {
		it('has a sync action fetchCartDetailRequest', () => {
			const expected = { type: actions.FETCH_CARTDETAIL_REQUEST };
			const actual = actions.fetchCartDetailRequest();
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchCartDetailFailure', () => {
			const expected = { type: actions.FETCH_CARTDETAIL_FAILURE, error: 'Oops' };
			const actual = actions.fetchCartDetailFailure('Oops');
			expect(actual).toEqual(expected);
		});

		it('has a sync action fetchCartDetailSuccess', () => {
			const expected = { type: actions.FETCH_CARTDETAIL_SUCCESS };
			const actual = actions.fetchCartDetailSuccess();
			expect(actual).toEqual(expected);
		});
	});

	describe('async action fetchCartDetail', () => {
		let dispatch;
		let fakePromise;
		let resolve;
		let reject;

		beforeEach(() => {
			dispatch = jasmine.createSpy('dispatch');
			fakePromise = jasmine.createSpyObj('fakePromise', ['then', 'catch']);
			api.cartDetail.and.returnValue(fakePromise);
			fakePromise.then.and.returnValue(fakePromise);
			fakePromise.catch.and.returnValue(fakePromise);
			const thunk = actions.fetchCartDetail();
			thunk(dispatch);
			resolve = fakePromise.then.calls.argsFor(0)[0];
			reject = fakePromise.then.calls.argsFor(0)[1];
			pushEvent.calls.reset();
		});

		it('initiates the request', () => {
			const expected = { type: actions.FETCH_CARTDETAIL_REQUEST };
			expect(dispatch).toHaveBeenCalledWith(expected);
			expect(pushEvent).not.toHaveBeenCalled();
		});

		it('calls the api cartDetail', () => {
			expect(api.cartDetail).toHaveBeenCalled();
		});

		it('will dispatch a failure', () => {
			dispatch.calls.reset();
			const expected = { type: actions.FETCH_CARTDETAIL_FAILURE, error: 'Oops' };
			reject('Oops');
			expect(dispatch).toHaveBeenCalledWith(expected);
			expect(pushEvent).not.toHaveBeenCalled();
			expect(navigate.redirectToBasket).not.toHaveBeenCalled();
		});

		it('will redirect to the basket page', () => {
			dispatch.calls.reset();
			reject({ code: 'ERR_CART_NO_ENTRIES' });
			expect(dispatch).not.toHaveBeenCalled();
			expect(pushEvent).not.toHaveBeenCalled();
			expect(navigate.redirectToBasket).toHaveBeenCalled();
		});

		it('will dispatch a success', () => {
			dispatch.calls.reset();
			const expected = { type: actions.FETCH_CARTDETAIL_SUCCESS };
			resolve({ tmid: '732bac947fbc42cabed627' });
			expect(dispatch).toHaveBeenCalledWith(expected);
			expect(pushEvent).toHaveBeenCalledWith('spc.cartLoaded', { tmid: '732bac947fbc42cabed627' });
		});

		describe('success fetchCartDetail init actions', () => {
			beforeEach(() => {
				dispatch.calls.reset();
			});

			it('will dispatch initDeliveryMode', () => {
				const payload = {
					deliveryMode: { id: 'cnc' }
				};
				deepfreeze(payload);
				resolve(payload);
				expect(inits.initDeliveryMode).toHaveBeenCalledWith(payload.deliveryMode);
			});

			it('will dispatch initPickupDetails', () => {
				const payload = {
					store: { id: 'store1' },
					contact: { firstName: 'Steve' }
				};
				deepfreeze(payload);
				resolve(payload);
				expect(inits.initPickupDetails).toHaveBeenCalledWith(payload);
			});

			it('will dispatch initSearchStores', () => {
				const payload = {
					store: { id: 'store1' }
				};
				deepfreeze(payload);
				resolve(payload);
				expect(inits.initSearchStores).toHaveBeenCalledWith([payload.store]);
			});

			it('will dispatch initSelectedAddress', () => {
				const payload = {
					deliveryAddress: { id: '1' }
				};
				deepfreeze(payload);
				resolve(payload);
				expect(inits.initSelectedAddress).toHaveBeenCalledWith(payload.deliveryAddress);
			});

			it('will dispatch initVoucher', () => {
				const payload = {
					voucher: { id: '1' }
				};
				deepfreeze(payload);
				resolve(payload);
				expect(inits.initVoucher).toHaveBeenCalledWith(payload.voucher);
			});

			it('will dispatch initTmd', () => {
				const payload = {
					tmdNumber: '09830498503945'
				};
				deepfreeze(payload);
				resolve(payload);
				expect(inits.initTmd).toHaveBeenCalledWith(payload.tmdNumber);
			});

			it('will dispatch initFlybuys', () => {
				const payload = {
					flybuysCode: '8001123412341234'
				};
				deepfreeze(payload);
				resolve(payload);
				expect(inits.initFlybuys).toHaveBeenCalledWith(payload.flybuysCode);
			});

			it('will dispatch initCartSummary', () => {
				const payload = {
					subtotal: { price: 1 },
					deliveryFee: { price: 2 },
					total: { price: 3 },
					entries: ['array', 'of', 'products']
				};
				deepfreeze(payload);
				resolve(payload);
				expect(inits.initCartSummary).toHaveBeenCalledWith(payload);
			});

			it('will dispatch all the the necessary actions', () => {
				const cart = {
					subtotal: { price: 1 },
					deliveryFee: { price: 2 },
					total: { price: 3 },
					entries: ['array', 'of', 'products'],
					voucher: { code: 'VALID_CODE' },
					orderDiscounts: { price: 4 }
				};
				const payload = {
					deliveryMode: { id: 'cnc' },
					store: { id: 'store1' },
					contact: { firstName: 'Steve' },
					deliveryAddress: { id: '1' },
					voucher: { code: 'VALID_CODE' },
					tmdNumber: '09830498503945',
					flybuysCode: '8001123412341234',
					...cart
				};
				deepfreeze(payload);
				resolve(payload);
				expect(inits.initDeliveryMode).toHaveBeenCalledWith(payload.deliveryMode);
				expect(inits.initPickupDetails).toHaveBeenCalledWith({
					store: payload.store,
					contact: payload.contact
				});
				expect(inits.initSelectedAddress).toHaveBeenCalledWith(payload.deliveryAddress);
				expect(inits.initVoucher).toHaveBeenCalledWith(payload.voucher);
				expect(inits.initTmd).toHaveBeenCalledWith(payload.tmdNumber);
				expect(inits.initFlybuys).toHaveBeenCalledWith(payload.flybuysCode);
				expect(inits.initCartSummary).toHaveBeenCalledWith(cart);
			});
		});
	});
});
