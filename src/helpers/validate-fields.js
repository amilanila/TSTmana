import * as rules from './validation-rules';

export default (values = {}) => {
	const fields = Object.keys(values);
	if (!fields.length) {
		return {};
	}
	return Object.assign(
		...fields
			.filter(key => rules[key])
			.map(key => {
				return { [key]: rules[key].call(null, values[key]) };
			})
	);
};
