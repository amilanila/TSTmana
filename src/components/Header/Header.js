import React from 'react';
import { PageHeader } from 'react-bootstrap';

const headerStyle = {
	'text-align': 'center',
	'font-weight': 'bold'
};

const Header = () => {
	return (
		<div style={{...headerStyle}}>
			<a href="/tmana/home">
				<PageHeader> Grasshoppers </PageHeader>
			</a>
		</div>
	);
};

export default Header;
