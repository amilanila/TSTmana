import { API_END_POINT, CmsAPI } from '../constants';
import { extractProp, get } from './common';

// Get SPC CMS content
export const getCmsContent = () => {
	return get(API_END_POINT + CmsAPI.CONTENT)
		.then(extractProp('slots'));
};
