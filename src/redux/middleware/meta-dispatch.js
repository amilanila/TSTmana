import { isFSA } from 'flux-standard-action';

const dispatchMeta = (name, meta, dispatch) => {
	const metaAction = meta && meta[name];

	if (isFSA(metaAction)) {
		dispatch(metaAction);
	}
};

const middleware = (name, before = false) => ({ dispatch }) => next => action => {
	if (before) {
		dispatchMeta(name, action.meta, dispatch);
	}
	next(action);
	if (!before) {
		dispatchMeta(name, action.meta, dispatch);
	}
};

export default middleware;
