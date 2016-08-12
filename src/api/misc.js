import { API_END_POINT, Misc } from '../constants';
import { extractProp, get } from './common';

export const getSession = () => {
	return get(API_END_POINT + Misc.SESSION)
		.then(extractProp('session'));
};

export const getEnv = () => {
	return get(API_END_POINT + Misc.ENV)
		.then(extractProp('env'));
};
