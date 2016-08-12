import * as gtm from './gtm';

describe('Google Tag Manager', () => {
	let gtmCreate;
	let dataLayer;

	beforeEach(() => {
		gtmCreate = window.gtmCreate = jasmine.createSpy('gtmCreate');
		dataLayer = window.dataLayer = [];
	});

	it('can be created', () => {
		gtm.create('GTM_FAKEID');
		expect(gtmCreate).toHaveBeenCalledWith('GTM_FAKEID');
	});

	it('cant  be created again', () => {
		gtm.create('GTM_FAKEID');
		gtm.create('GTM_FAKEID2');
		expect(gtmCreate).not.toHaveBeenCalledWith('GTM_FAKEID2');
	});

	it('can push events', () => {
		gtm.pushEvent('spc.event');
		expect(dataLayer).toEqual([{
			event: 'spc.event'
		}]);
	});

	it('can push events with data', () => {
		gtm.pushEvent('spc.event', {
			key1: 'value1',
			key2: 'value2'
		});
		expect(dataLayer).toEqual([{
			event: 'spc.event',
			key1: 'value1',
			key2: 'value2'
		}]);
	});
});
