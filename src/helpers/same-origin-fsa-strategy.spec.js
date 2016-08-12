import sameOriginFSAStrategy from './same-origin-fsa-strategy';
import { clearPaymentMethod } from '../redux/modules/selectedPaymentMethod';
import { ipgPlaceOrder } from '../redux/modules/placeOrderIpg';

describe('sameOriginFSAStrategy', () => {
	let impl;
	let dispatch;

	const csrfToken = '9847958245345';
	const port = location.port ? `:${location.port}` : '';
	const origin = `${location.protocol}\/\/${location.hostname}${port}`;

	beforeEach(() => {
		const addEventListener = window.addEventListener = jasmine.createSpy('addEventListener');
		const getState = jasmine.createSpy('getState');
		getState.and.returnValue({ session: { info: { csrfToken } } });
		dispatch = jasmine.createSpy('dispatch');
		sameOriginFSAStrategy({ dispatch, getState });
		impl = addEventListener.calls.mostRecent().args[1];
	});

// IPG_PAYMENT_COMPLETE

	it('receives IPG_PAYMENT_CANCEL and dispatches a clearPaymentMethod', () => {
		const fsa = {
			type: 'IPG_PAYMENT_CANCEL'
		};
		impl({
			origin,
			data: { csrfToken, fsa }
		});
		const expected = clearPaymentMethod('cancel');
		expect(dispatch).toHaveBeenCalledWith(expected);
	});

	it('receives IPG_PAYMENT_ABORT and dispatches a clearPaymentMethod', () => {
		const fsa = {
			type: 'IPG_PAYMENT_ABORT'
		};
		impl({
			origin,
			data: { csrfToken, fsa }
		});
		const expected = clearPaymentMethod('abort');
		expect(dispatch).toHaveBeenCalledWith(expected);
	});

	it('receives IPG_PAYMENT_COMPLETE and dispatches a ipgPlaceOrder', () => {
		const fsa = {
			type: 'IPG_PAYMENT_COMPLETE'
		};
		impl({
			origin,
			data: { csrfToken, fsa }
		});
		const expected = ipgPlaceOrder().toString();
		expect(dispatch.calls.mostRecent().args[0].toString()).toEqual(expected);
	});

	it('does not dispatch with incorrect csrfToken', () => {
		const fsa = {
			type: 'IPG_PAYMENT_ABORT'
		};
		impl({
			origin,
			data: { csrfToken: 'other', fsa }
		});
		expect(dispatch).not.toHaveBeenCalled();
	});

	it('does not dispatch a without csrfToken', () => {
		const fsa = {
			type: 'IPG_PAYMENT_COMPLETE'
		};
		impl({
			origin,
			data: { fsa }
		});
		expect(dispatch).not.toHaveBeenCalled();
	});

	it('ignores other messages', () => {
		const fsa = {
			type: 'MY_ACTION'
		};
		impl({
			origin,
			data: { somethingelse: fsa }
		});
		expect(dispatch).not.toHaveBeenCalled();
	});

	it('doesnt throw for a string', () => {
		impl({
			origin,
			data: 'This is a normal String.'
		});
		expect(dispatch).not.toHaveBeenCalled();
	});
});
