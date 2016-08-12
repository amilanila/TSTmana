const state = new Map();

const ENTRIES_KEY = 'entries';

export const getFormattedPrice = (value) => {
	return '$' + parseFloat(value, 10).toFixed(2);
};

export const setPrice = (key, value) => {
	state.set(key, {
		[key]: {
			value,
			formattedValue: getFormattedPrice(value)
		}
	});
};

export const getPrice = (key) => {
	const partial = state.get(key);
	return (partial && partial[key] && partial[key].value) || 0;
};

export const addCartEntry = (item) => {
	const partial = state.get(ENTRIES_KEY);
	if (partial && partial.entries) {
		partial.entries.push(item);
	}
};

export const setCartEntries = () => {
	state.set(ENTRIES_KEY, { [ENTRIES_KEY]: [] });
	if (state.get('containsDigitalEntriesOnly')) {
		addCartEntry(
			{
				product: {
					code: '889703_nocolour',
					name: 'Coles e-Gift Card',
					imageUrl: 'https://www.target.com.au/medias/' +
						'static_content/product/images/large/85/19/A888519.jpg'
				},
				quantity: 1,
				entryNumber: 0,
				totalPrice: {
					value: 25,
					formattedValue: getFormattedPrice(25)
				},
				basePrice: {
					value: 25,
					formattedValue: getFormattedPrice(25)
				},
				totalItemPrice: {
					value: 25,
					formattedValue: getFormattedPrice(25)
				},
				dealsApplied: false
			}
		);
	} else {
		addCartEntry(
			{
				product: {
					code: '58836279',
					name: 'Piping Hot&reg; Parka Jacket',
					size: '2',
					colour: 'KHAKI',
					imageUrl: 'https://www.target.com.au/' +
						'medias/static_content/product/images/large/56/21/A925621.jpg'
				},
				quantity: 1,
				entryNumber: 0,
				totalPrice: {
					value: 39,
					formattedValue: getFormattedPrice(39)
				},
				basePrice: {
					value: 39,
					formattedValue: getFormattedPrice(39)
				},
				totalItemPrice: {
					value: 39,
					formattedValue: getFormattedPrice(39)
				},
				dealsApplied: false
			}
		);
		addCartEntry(
			{
				product: {
					code: '58907412',
					name: 'Beats By Dr. Dre Solo 2 On-Ear Headphones - Blue',
					size: '',
					colour: 'BLUE',
					imageUrl: 'https://www.target.com.au/' +
						'medias/static_content/product/images/large/40/49/A884049.jpg'
				},
				quantity: 2,
				entryNumber: 1,
				totalPrice: {
					value: 358,
					formattedValue: getFormattedPrice(358)
				},
				basePrice: {
					value: 229,
					formattedValue: getFormattedPrice(229)
				},
				totalItemPrice: {
					value: 458,
					formattedValue: getFormattedPrice(458)
				},
				discountPrice: {
					value: 100,
					formattedValue: getFormattedPrice(100)
				},
				dealsApplied: true
			}
		);
		addCartEntry(
			{
				product: {
					code: '58984376',
					name: 'Helsinki Quilt Cover Set',
					size: 'Queen',
					colour: 'Multi',
					imageUrl: 'https://www.target.com.au/' +
						'medias/static_content/product/images/large/48/18/A914818.jpg'
				},
				quantity: 1,
				entryNumber: 2,
				totalPrice: {
					value: 37,
					formattedValue: getFormattedPrice(37)
				},
				basePrice: {
					value: 39,
					formattedValue: getFormattedPrice(39)
				},
				totalItemPrice: {
					value: 39,
					formattedValue: getFormattedPrice(39)
				},
				discountPrice: {
					value: 2,
					formattedValue: getFormattedPrice(2)
				},
				dealsApplied: false
			}
		);
	}
};

export default state;
