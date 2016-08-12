import reducer, * as actions from './analytics';

describe('analytics', () => {
	describe('reducer', () => {
		it('is a noop', () => {
			const actual = reducer();
			expect(actual).not.toBeDefined();
		});
	});

	describe('sync actions', () => {
		it('has a sync action analyticsEvent', () => {
			const actual = actions.analyticsEvent('Action', 'Label');
			const expected = {
				type: actions.ANALYTICS_EVENT,
				payload: {
					category: 'SPC',
					action: 'Action',
					label: 'Label'
				}
			};
			expect(actual).toEqual(expected);
		});
	});
});
