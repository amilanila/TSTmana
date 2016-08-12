const successRegistered = {
	success: true,
	data: {
		isRegistered: true
	}
};

const successUnregistered = {
	success: true,
	data: {
		isRegistered: false
	}
};

function makeFailure(code) {
	return {
		success: false,
		data: {
			error: { code, message: null }
		}
	};
}

const BODY_PATTERN_EMAIL_EXISTS = 'This email id has already been registered. Please sign in';
const BODY_PATTERN_EMAIL_INVALID = 'Email Address must be in a valid Email Address format';
export function parseRegistered(response) {
	if (response.status >= 200 && response.status < 300) {
		return response.text().then(body => {
			if (body.match(BODY_PATTERN_EMAIL_EXISTS)) {
				return successRegistered;
			}

			if (body.match(BODY_PATTERN_EMAIL_INVALID)) {
				return makeFailure('ERR_INVALID_EMAIL');
			}

			return successUnregistered;
		});
	}

	throw Error('Unexpected error occurred');
}
