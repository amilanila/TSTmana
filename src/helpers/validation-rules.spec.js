import * as rules from './validation-rules.js';

describe('Validation Rules', () => {
	describe('title', () => {
		it('is required', () => {
			const expected = 'What is your title?';
			const actual = rules.title();
			expect(actual).toEqual(expected);
		});
	});

	describe('firstName', () => {
		it('is required', () => {
			const expected = 'What is your first name?';
			const actual = rules.firstName();
			expect(actual).toEqual(expected);
		});

		it('cannot been just spaces', () => {
			const expected = 'What is your first name?';
			const actual = rules.firstName(' ');
			expect(actual).toEqual(expected);
		});

		it('is an error when less than 2 chars', () => {
			const expected = 'Please enter a first name between 2 and 32 characters.';
			const actual = rules.firstName('a');
			expect(actual).toEqual(expected);
		});

		it('can be 2 chars', () => {
			const actual = rules.firstName('ab');
			expect(actual).not.toBeDefined();
		});

		it('can be 32 chars', () => {
			const actual = rules.firstName('aa-bb-cc-dd\'ee-ff-gg-hh-ii-jj-kk');
			expect(actual).not.toBeDefined();
		});

		it('is an error when greater than 32 chars', () => {
			const expected = 'Please enter a first name between 2 and 32 characters.';
			const actual = rules.firstName('aaa-bb-cc-dd-ee-ff-gg-hh-ii-jj-kk');
			expect(actual).toEqual(expected);
		});

		it('is an error special chars on the end', () => {
			const expected = 'Please enter a valid first name.';
			const actual = rules.firstName('-bb-cc-dd-ee-');
			expect(actual).toEqual(expected);
		});

		it('is an error when numbers are used', () => {
			const expected = 'Please enter a valid first name.';
			const actual = rules.firstName('Jay2theZ');
			expect(actual).toEqual(expected);
		});

		it('is an error when numbers are used', () => {
			const expected = 'Please enter a valid first name.';
			const actual = rules.firstName('2pac');
			expect(actual).toEqual(expected);
		});

		it('is an error when numbers are used', () => {
			const expected = 'Please enter a valid first name.';
			const actual = rules.firstName('Pac2');
			expect(actual).toEqual(expected);
		});

		it('is an error when strange chars are used', () => {
			const expected = 'Please enter a valid first name.';
			const actual = rules.firstName('!@#$%^&*()_+()+=');
			expect(actual).toEqual(expected);
		});

		it('counts spaces as valid', () => {
			const actual = rules.firstName('          abcdefghifkl         ');
			expect(actual).not.toBeDefined();
		});
	});

	describe('lastName', () => {
		it('is required', () => {
			const expected = 'What is your last name?';
			const actual = rules.lastName();
			expect(actual).toEqual(expected);
		});

		it('cannot been just spaces', () => {
			const expected = 'What is your last name?';
			const actual = rules.lastName(' ');
			expect(actual).toEqual(expected);
		});

		it('is an error when less than 2 chars', () => {
			const expected = 'Please enter a last name between 2 and 32 characters.';
			const actual = rules.lastName('a');
			expect(actual).toEqual(expected);
		});

		it('can be 2 chars', () => {
			const actual = rules.lastName('ab');
			expect(actual).not.toBeDefined();
		});

		it('can be 32 chars', () => {
			const actual = rules.lastName('aa-bb-cc-dd\'ee-ff-gg-hh-ii-jj-kk');
			expect(actual).not.toBeDefined();
		});

		it('is an error when greater than 32 chars', () => {
			const expected = 'Please enter a last name between 2 and 32 characters.';
			const actual = rules.lastName('aaa-bb-cc-dd-ee-ff-gg-hh-ii-jj-kk');
			expect(actual).toEqual(expected);
		});

		it('is an error special chars on the end', () => {
			const expected = 'Please enter a valid last name.';
			const actual = rules.lastName('-bb-cc-dd-ee-');
			expect(actual).toEqual(expected);
		});

		it('is an error when numbers are used', () => {
			const expected = 'Please enter a valid last name.';
			const actual = rules.lastName('Jay2theZ');
			expect(actual).toEqual(expected);
		});

		it('is an error when strange chars are used', () => {
			const expected = 'Please enter a valid last name.';
			const actual = rules.lastName('!@#$%^&*()_+()+=');
			expect(actual).toEqual(expected);
		});

		it('counts spaces as valid', () => {
			const actual = rules.lastName('          abcdefghifkl         ');
			expect(actual).not.toBeDefined();
		});
	});

	describe('mobilePhone', () => {
		it('is required', () => {
			const expected = 'What is your mobile number?';
			const actual = rules.mobileNumber();
			expect(actual).toEqual(expected);
		});

		it('cannot been just spaces', () => {
			const expected = 'What is your mobile number?';
			const actual = rules.mobileNumber(' ');
			expect(actual).toEqual(expected);
		});

		const valid = [
			// The Good
			'0400123456',
			'0500123456',
			'0400 123 456',
			' 0400 123 456 ',
			'0500 123 456',
			'+61400 123 456',
			' +61400 123 456 ',
			'+61500 123 456',
			'61400 123 456',
			' 61400 123 456 ',
			'61500 123 456',

			// The Ugly
			'0400123456789012'
		];

		valid.forEach(num => {
			it(`expects ${num} to be valid`, () => {
				expect(rules.mobileNumber(num)).not.toBeDefined();
			});
		});

		const invalidLength = [
			'0',
			'04',
			'043',
			'0434',
			'04345',
			'043456',
			'0434567',
			'04345678',
			'043456789',
			'04345678901234567'
		];

		invalidLength.forEach(num => {
			it(`expects ${num} to be invalid`, () => {
				const expected = 'Please enter a mobile number between 10 and 16 digits.';
				expect(rules.mobileNumber(num)).toEqual(expected);
			});
		});

		const invalid = [
			'+610300 123 456',
			'+610040 0123 456',
			'd+61040 123 456',
			'+6_140 23 456',
			'030 0123 456',
			'140 234 40456',
			'Hello World',
			'04 NaNaN Batman'
		];

		invalid.forEach(num => {
			it(`expects ${num} to be valid`, () => {
				expect(rules.mobileNumber(num)).toEqual('Please enter a valid mobile number.');
			});
		});
	});

	describe('storeNumber', () => {
		it('is required', () => {
			const expected = 'Please select a store.';
			const actual = rules.storeNumber();
			expect(actual).toEqual(expected);
		});

		it('is required even for empty strings', () => {
			const expected = 'Please select a store.';
			const actual = rules.storeNumber('  ');
			expect(actual).toEqual(expected);
		});

		it('passes when provided', () => {
			const actual = rules.storeNumber('3000');
			expect(actual).not.toBeDefined();
		});

		it('passes when provided', () => {
			const actual = rules.storeNumber(3000);
			expect(actual).not.toBeDefined();
		});
	});

	describe('search', () => {
		it('cannot been just spaces', () => {
			const expected = 'What is your location?';
			const actual = rules.search(' ');
			expect(actual).toEqual(expected);
		});

		it('is an error when less than 1 char', () => {
			const expected = 'What is your location?';
			const actual = rules.search('');
			expect(actual).toEqual(expected);
		});

		it('can be 1 char', () => {
			const actual = rules.search('a');
			expect(actual).not.toBeDefined();
		});

		it('can be 32 chars', () => {
			const actual = rules.search('aa-bb-cc-dd\'ee-ff-gg-hh-ii-jj-kk');
			expect(actual).not.toBeDefined();
		});

		it('is an error when greater than 32 chars', () => {
			const expected = 'Please enter a location between 1 and 32 characters.';
			const actual = rules.search('aaa-bb-cc-dd-ee-ff-gg-hh-ii-jj-kk');
			expect(actual).toEqual(expected);
		});

		it('counts spaces as valid', () => {
			const actual = rules.search('          abcdefghifkl         ');
			expect(actual).not.toBeDefined();
		});
	});

	describe('line1', () => {
		it('is required', () => {
			const expected = 'What is your address line 1?';
			const actual = rules.line1();
			expect(actual).toEqual(expected);
		});

		it('cannot been just spaces', () => {
			const expected = 'What is your address line 1?';
			const actual = rules.line1(' ');
			expect(actual).toEqual(expected);
		});

		it('is an error when less than 2 chars', () => {
			const expected = 'Please enter an address line 1 between 2 and 40 characters.';
			const actual = rules.line1('a');
			expect(actual).toEqual(expected);
		});

		it('can be 2 chars', () => {
			const actual = rules.line1('ab');
			expect(actual).not.toBeDefined();
		});

		it('can be 40 chars', () => {
			const actual = rules.line1('aa-bb-cc-dd-ee-ff-gg-hh-ii-jj-kk-ll-mm-n');
			expect(actual).not.toBeDefined();
		});

		it('cannot have more than 40 chars', () => {
			const expected = 'Please enter an address line 1 between 2 and 40 characters.';
			const actual = rules.line1('aaa-bb-cc-dd-ee-ff-gg-hh-ii-jj-kk-ll-mm-n');
			expect(actual).toEqual(expected);
		});

		it('cannot have some special characters', () => {
			const expected = 'Please enter a valid address line 1.';
			const actual = rules.line1('[]!"#$%&()*+,./:;<=>?@^_`{|}\\~');
			expect(actual).toEqual(expected);
		});

		it('can have hyphens, apostrophes, spaces, forward slashes, letters and numbers', () => {
			const actual = rules.line1('1/1800 -testers\' address 2 //--');
			expect(actual).not.toBeDefined();
		});
	});

	describe('line2', () => {
		it('is not required', () => {
			const actual = rules.line2();
			expect(actual).not.toBeDefined();
		});

		it('can be just spaces', () => {
			const actual = rules.line2(' ');
			expect(actual).not.toBeDefined();
		});

		it('is an error when less than 2 chars', () => {
			const expected = 'Please enter an address line 2 between 2 and 40 characters.';
			const actual = rules.line2('a');
			expect(actual).toEqual(expected);
		});

		it('can be 2 chars', () => {
			const actual = rules.line2('ab');
			expect(actual).not.toBeDefined();
		});

		it('can be 40 chars', () => {
			const actual = rules.line2('aa-bb-cc-dd-ee-ff-gg-hh-ii-jj-kk-ll-mm-n');
			expect(actual).not.toBeDefined();
		});

		it('cannot have more than 40 chars', () => {
			const expected = 'Please enter an address line 2 between 2 and 40 characters.';
			const actual = rules.line2('aaa-bb-cc-dd-ee-ff-gg-hh-ii-jj-kk-ll-mm-n');
			expect(actual).toEqual(expected);
		});

		it('cannot have some special characters', () => {
			const expected = 'Please enter a valid address line 2.';
			const actual = rules.line2('[]!"#$%&()*+,./:;<=>?@^_`{|}\\~');
			expect(actual).toEqual(expected);
		});

		it('can have hyphens, apostrophes, spaces, forward slashes, letters and numbers', () => {
			const actual = rules.line2('1/1800 -testers\' address with 2 //--');
			expect(actual).not.toBeDefined();
		});
	});

	describe('town', () => {
		it('is required', () => {
			const expected = 'What is your city/suburb?';
			const actual = rules.town();
			expect(actual).toEqual(expected);
		});

		it('cannot be just spaces', () => {
			const expected = 'What is your city/suburb?';
			const actual = rules.town(' ');
			expect(actual).toEqual(expected);
		});

		it('can be 1 character', () => {
			const actual = rules.town('a');
			expect(actual).not.toBeDefined();
		});

		it('can be 64 chars', () => {
			const actual = rules.town(
				'abcd efgh ijkl mno pqr stu vwx yzA BC DEF GHI JKLMN OPQRSTUVWXYZ'
			);
			expect(actual).not.toBeDefined();
		});

		it('can have spaces', () => {
			const actual = rules.town('  suburb with spaces   ');
			expect(actual).not.toBeDefined();
		});

		it('cannot have more than 64 chars', () => {
			const expected = 'Please enter a city/suburb between 1 and 64 letters.';
			const actual = rules.town(
				'abcd efgh ijkl mno pqr stu vwx yzA BC DEF GHI JKLMN OPQRSTUV WXYZ'
			);
			expect(actual).toEqual(expected);
		});

		it('cannot have some special characters', () => {
			const expected = 'Please enter a valid city/suburb.';
			const actual = rules.town('-\'/[]!"#$%&()*+,./:;<=>?@^_`{|}\\~');
			expect(actual).toEqual(expected);
		});

		it('cannot have numbers', () => {
			const expected = 'Please enter a valid city/suburb.';
			const actual = rules.town('123');
			expect(actual).toEqual(expected);
		});

		it('can have letters', () => {
			const actual = rules.line2('town');
			expect(actual).not.toBeDefined();
		});
	});

	describe('state', () => {
		it('is required', () => {
			const expected = 'What is your state?';
			const actual = rules.state();
			expect(actual).toEqual(expected);
		});
	});

	describe('postalCode', () => {
		it('is required', () => {
			const expected = 'What is your postcode?';
			const actual = rules.postalCode();
			expect(actual).toEqual(expected);
		});

		it('cannot be just spaces', () => {
			const expected = 'What is your postcode?';
			const actual = rules.postalCode(' ');
			expect(actual).toEqual(expected);
		});

		it('cannot have some special characters', () => {
			const expected = 'Please enter a postcode with 4 digits.';
			const actual = rules.postalCode('-\'/[]!"#$%&()*+,./:;<=>?@^_`{|}\\~');
			expect(actual).toEqual(expected);
		});

		it('cannot have letters', () => {
			const expected = 'Please enter a postcode with 4 digits.';
			const actual = rules.postalCode('12d');
			expect(actual).toEqual(expected);
		});

		it('should be 4 digits', () => {
			const expected = 'Please enter a postcode with 4 digits.';
			const actual = rules.postalCode('12345');
			expect(actual).toEqual(expected);
		});
	});

	describe('phone', () => {
		it('is required', () => {
			const expected = 'What is your phone number?';
			const actual = rules.phone();
			expect(actual).toEqual(expected);
		});

		it('cannot been just spaces', () => {
			const expected = 'What is your phone number?';
			const actual = rules.phone(' ');
			expect(actual).toEqual(expected);
		});

		const valid = [
			// The Good
			'0400123456',
			'0500123456',
			'0400 123 456',
			' 0400 123 456 ',
			'0500 123 456',
			'+61400 123 456',
			' +61400 123 456 ',
			'+61500 123 456',
			'61400 123 456',
			' 61400 123 456 ',
			'61500 123 456',
			'0212345678',
			'0312 345 678',
			'07 123 45 678',
			'  08 12 34 5678 ',
			'+61300 123 456',
			'61700 123 456',
			'61800 123 456',
			'071 2345 6789',
			'10 1 2345 6789',
			'+61300 123 456',
			'03-128-75-123',
			// The Ugly
			'0400123456789012',
			'0800123456789012'
		];

		valid.forEach(num => {
			it(`expects ${num} to be valid`, () => {
				expect(rules.phone(num)).not.toBeDefined();
			});
		});

		const invalidLength = [
			'0',
			'03',
			'043',
			'0534',
			'03345',
			'033456',
			'0334567',
			'03345678',
			'03345678901234567'
		];

		invalidLength.forEach(num => {
			it(`expects ${num} to be invalid`, () => {
				const expected = 'Please enter a phone number between 9 and 16 digits.';
				expect(rules.phone(num)).toEqual(expected);
			});
		});

		const invalid = [
			'++ 61030 03 456',
			'd+61020 123 456',
			'+6_140 23 456',
			'Hello World',
			'04 NaNaN Batman'
		];

		invalid.forEach(num => {
			it(`expects ${num} to be valid`, () => {
				expect(rules.phone(num)).toEqual('Please enter a valid phone number.');
			});
		});
	});

	describe('email validation as per current hybris', () => {
		it('is required', () => {
			const expected = 'What is your email?';
			const actual = rules.email();
			expect(actual).toEqual(expected);
		});

		/* eslint-disable max-len */
		const valid = [
			'a@aa.fr',
			'ab@aa.fr',
			'abC@aa.fr',
			'a.b@aa.fr',
			'target@aa.fr',
			'target@ge.com.au',
			'target@ge.com',
			'target@g.com',
			'target@acom.au.au.aaa',
			'target@a888.fr',
			'target@TEST8-8.fr',
			'jean-michel@laboiteatestdu45.fr',
			'target@target.com.au',
			'jack@aus.com.au',
			'MAXIMELEGRAND\'ROIDUCODE@MARTINGMATGNON.COM',
			'eclispeIndi{notthebestbytheway}+remembermetoleaveit@doe.fr',
			'eclispeIndi.notthebestbytheway\'+remembermetoleaveit@whatisthemaximumsizehereIhavenoidea.fr',
			'johnisaeallybignamebutsincethelimitmightbe64caractersitshouldbe@doe.fr',
			'bruno@hotmail.fr',
			'niceandsimple@example.com',
			'very.common@example.com',
			'a.little.lengthy.but.fine@dept.example.com',
			'disposable.style.email.with+symbol@example.com',
			'user@[ipv6:2001:db8:1ff::a0b:dbd0]',
			'user@[IPv634:2001:db8:1ff:7s:a0b:dbd0]',
			'user@[10.192.27.2]',
			'user@[0.0.0.0]',
			'much.moreunusual@example.com',
			'very.unusua@unusual.comexample.com',
			'very.unusual@strange.example.com',
			'postbox@com.autyyyyyyy',
			'admin@mailserver1.com',
			'!#$%&\'*+-/=?^_`{}|~@example.org',
			';!#$%&\'*+-=?^_`{}|~a@example.org',
			'CanTBEEXMP@example.org',
			'musthaveaname@qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm.com',
			'emptyisnotgood@qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm1234567890123456789qq.ai',
			'qwertyuiop12345678901234567890123456789012345678901234567890qwer@qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm1234567890123456789qq.org',
			'jean-Francoise@gmail.com.12',
			'Martib@1example.org'
		];
		/* eslint-enable max-len */

		valid.forEach(email => {
			it(`expects ${email} to be valid`, () => {
				expect(rules.email(email)).not.toBeDefined();
			});
		});

		/* eslint-disable max-len */
		const invalid = [
			'very;.(),:;<>[].VERY.very@',
			'\\;very.unusual@strange.example.com',
			'()<>[]:,;@!#$%&\'*+-=?^_`{}| ~.a@example.org',
			'johnisaeallybignamebutsincethelimitmightbe64caractersitshouldbenotallright@doe.fr',
			'user@IPv6:2001:db8:1ff::a0b:dbd0]',
			'Martib@ex-ample.org-',
			' @example.org',
			'.martin@example.org',
			'martin.@example.org',
			'martin@exampleorg',
			'.@exampleorg',
			'\u2000@exampleorg',
			'@exampleorg',
			'martin.@asd@example.org',
			'martin@example@.org',
			'qwertyuiop12345678901234567890123456789012345678901234567890qwera@qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm1234567890123456789qq',
			'qwertyuiop12345678901234567890123456789012345678901234567890qwer@Aqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm1234567890123456789qq'
		];
		/* eslint-enable max-len */

		invalid.forEach(email => {
			it(`expects ${email} to be valid`, () => {
				expect(rules.email(email)).toEqual('Please enter a valid email.');
			});
		});
	});

	describe('singleLineId', () => {
		it('is required', () => {
			const expected = 'What is your address?';
			const actual = rules.singleLineId();
			expect(actual).toEqual(expected);
		});
	});

	describe('singleLineLabel', () => {
		it('is required', () => {
			const expected = 'Please select an address.';
			const actual = rules.singleLineLabel();
			expect(actual).toEqual(expected);
		});
	});
});
