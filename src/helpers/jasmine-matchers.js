import reactElementToJSXString from 'react-element-to-jsx-string';
import collapse from 'collapse-white-space';

function matcher(util, customEqualityTesters = []) {
	return (actual, expected) => {
		const actualJSXString = collapse(reactElementToJSXString(actual));
		const expectedJSXString = collapse(reactElementToJSXString(expected));

		const result = {
			pass: util(actualJSXString, expectedJSXString, customEqualityTesters)
		};

		if (result.pass) {
			result.message = 'Expected:\n' + reactElementToJSXString(actual);
		} else {
			result.message = 'Expected:\n ' + reactElementToJSXString(actual)
				+ '\nTo contain:\n' + reactElementToJSXString(expected);
		}

		return result;
	};
}

export function toContainJSX(util, customEqualityTesters) {
	return {
		compare: matcher(util.contains, customEqualityTesters)
	};
}

export function toEqualJSX(util, customEqualityTesters) {
	return {
		compare: matcher(util.equals, customEqualityTesters)
	};
}
