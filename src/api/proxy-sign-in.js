const BODY_PATTERN_INCORRECT = 'Your username or password was incorrect.';
const BODY_PATTERN_LOCKED_ACCOUNT = 'Due to excessive failed login attempts, your account has been locked.'; // eslint-disable-line max-len

function makeFailure(code) {
	return {
		success: false,
		data: {
			error: { code, message: null }
		}
	};
}

const successSignIn = {
	success: true,
	data: {
		redirectUrl: '/checkout'
	}
};

export function parseSignIn(response) {
	if (response.status === 200) {
		return response.text().then(body => {
			if (body.match(BODY_PATTERN_LOCKED_ACCOUNT)) {
				return makeFailure('ERR_LOGIN_ACCOUNT_LOCKED');
			} else if (body.match(BODY_PATTERN_INCORRECT)) {
				return makeFailure('ERR_LOGIN_BAD_CREDENTIALS');
			}

			return successSignIn;
		});
	}

	throw Error('Unexpected error occurred');
}
