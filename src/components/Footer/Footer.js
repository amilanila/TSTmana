import React from 'react';

const baseStyle = {
	'text-align': 'center',
	'background-color': 'black',
	'font-color': '#000000',
	'vertical-align': 'middel',
	'height': 100
};

const copyRightTextStyle = {
	'position': 'relative',
	'top': '50%' 
};

const Footer = () => {
	return (
		<div style={ {...baseStyle} }>
			<span style={ {...copyRightTextStyle} }>Copyright@ ANS Consulting Pty Ltd</span>
		</div>
	);
};

export default Footer;
