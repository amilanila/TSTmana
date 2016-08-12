import * as lib from './tracking';

describe('Tracking', () => {
	let ga;

	beforeEach(() => {
		ga = window.ga = jasmine.createSpy('ga');
	});

	it('can be created', () => {
		const expected = [
			'create',
			'UA_FAKEID', {
				cookieDomain: jasmine.any(String),
				siteSpeedSampleRate: jasmine.any(Number),
				allowLinker: true
			}
		];
		lib.create('UA_FAKEID');
		expect(ga).toHaveBeenCalledWith(...expected);
		expect(ga).toHaveBeenCalledWith('require', 'ec');
	});

	it('tracks a page view', () => {
		const expectedSet = ['set', { page: '/my-url' }];
		const expected = ['send', 'pageview'];
		lib.trackPage('/my-url');
		expect(ga).toHaveBeenCalledWith(...expectedSet);
		expect(ga).toHaveBeenCalledWith(...expected);
	});

	it('tracks an interactive event', () => {
		const expected = ['send', 'event', 'SPC', 'flybuys', 'redeemed'];
		lib.trackEvent({
			category: 'SPC',
			action: 'flybuys',
			label: 'redeemed'
		});
		expect(ga).toHaveBeenCalledWith(...expected);
	});

	it('tracks an not interactive event', () => {
		const expected = ['send', 'event', 'SPC', 'flybuys', 'disabled', {
			nonInteraction: true
		}];
		lib.trackPassiveEvent({
			category: 'SPC',
			action: 'flybuys',
			label: 'disabled'
		});
		expect(ga).toHaveBeenCalledWith(...expected);
	});
});
