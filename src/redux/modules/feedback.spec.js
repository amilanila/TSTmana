import deepfreeze from 'deep-freeze';
import reducer, * as actions from './feedback';

describe('feedback', () => {
	let message;
	let counter;

	beforeEach(() => {
		message = `Feedback string with timestamp${+new Date()} and counter ${++counter}`;
	});

	describe('reducer', () => {
		it('has an empty feedback for initial state', () => {
			const actual = reducer(undefined, {});
			const expected = {};
			expect(actual).toEqual(expected);
		});

		it('has a warning feedback', () => {
			const initialState = {};
			const action = {
				type: actions.FEEDBACK_WARNING,
				payload: { message }
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				type: 'warning',
				message
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('has a error feedback', () => {
			const initialState = {};
			const action = {
				type: actions.FEEDBACK_ERROR,
				payload: { message }
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				type: 'error',
				message
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('has a success feedback', () => {
			const initialState = {};
			const action = {
				type: actions.FEEDBACK_SUCCESS,
				payload: { message }
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				type: 'success',
				message
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('has a information feedback', () => {
			const initialState = {};
			const action = {
				type: actions.FEEDBACK_INFORMATION,
				payload: { message }
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {
				type: 'info',
				message
			};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});

		it('can dismiss a feedback', () => {
			const initialState = {
				type: 'info',
				message
			};
			const action = {
				type: actions.FEEDBACK_DISMISS,
				payload: { message }
			};
			deepfreeze(initialState);
			deepfreeze(action);
			const expected = {};
			const actual = reducer(initialState, action);
			expect(actual).toEqual(expected);
		});
	});

	describe('sync actions', () => {
		it('has a sync action feedbackWarning', () => {
			const expected = {
				type: actions.FEEDBACK_WARNING,
				payload: {
					message
				}
			};
			const actual = actions.feedbackWarning(message);
			expect(actual).toEqual(expected);
		});

		it('has a sync action feedbackError', () => {
			const expected = {
				type: actions.FEEDBACK_ERROR,
				payload: {
					message
				}
			};
			const actual = actions.feedbackError(message);
			expect(actual).toEqual(expected);
		});

		it('has a sync action feedbackSuccess', () => {
			const expected = {
				type: actions.FEEDBACK_SUCCESS,
				payload: {
					message
				}
			};
			const actual = actions.feedbackSuccess(message);
			expect(actual).toEqual(expected);
		});

		it('has a sync action feedbackInformation', () => {
			const expected = {
				type: actions.FEEDBACK_INFORMATION,
				payload: {
					message
				}
			};
			const actual = actions.feedbackInformation(message);
			expect(actual).toEqual(expected);
		});

		it('has a sync action feedbackSuccess', () => {
			const expected = { type: actions.FEEDBACK_DISMISS };
			const actual = actions.feedbackDismiss();
			expect(actual).toEqual(expected);
		});
	});
});
