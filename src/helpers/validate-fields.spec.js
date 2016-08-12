describe('Validation Rules', () => {
	let validateFields;
	let rules;

	beforeEach(() => {
		rules = jasmine.createSpyObj('rules', ['firstName', 'lastName']);
		rules.firstName.and.returnValue('~firstName~');
		rules.lastName.and.returnValue('~lastName~');
		validateFields = require('inject!./validate-fields')({
			'./validation-rules': rules
		}).default;
	});

	it('is not fussed about empty fields', () => {
		const expected = {};
		const actual = validateFields();
		expect(actual).toEqual(expected);
	});

	it('validates part of the overall form', () => {
		const expected = {
			firstName: '~firstName~'
		};
		const actual = validateFields({
			firstName: 'My firstName'
		});
		expect(actual).toEqual(expected);
		expect(rules.firstName).toHaveBeenCalledWith('My firstName');
	});

	it('validates overall form', () => {
		const expected = {
			firstName: '~firstName~',
			lastName: '~lastName~'
		};
		const actual = validateFields({
			firstName: 'My firstName',
			lastName: 'My lastName'
		});
		expect(actual).toEqual(expected);
		expect(rules.firstName).toHaveBeenCalledWith('My firstName');
		expect(rules.lastName).toHaveBeenCalledWith('My lastName');
	});

	it('validates overall form and is grace of fields that dont exist', () => {
		const expected = {
			firstName: '~firstName~',
			lastName: '~lastName~'
		};
		const actual = validateFields({
			firstName: 'My firstName',
			lastName: 'My lastName',
			cricketScore: 400
		});
		expect(actual).toEqual(expected);
		expect(rules.firstName).toHaveBeenCalledWith('My firstName');
		expect(rules.lastName).toHaveBeenCalledWith('My lastName');
	});
});
