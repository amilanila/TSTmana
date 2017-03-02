import React from 'react';

const baseStyle = {
	'text-align': 'center',
	'margin-top': -35,
	'background-color': 'black',
	'font-color': '#000000',
	'height': 100
};

const Footer = () => {
	return (
		<div style={ {...baseStyle} }>
			Copyright@ ANS Consulting Pty Ltd
		</div>
	);
};

export default Footer;
