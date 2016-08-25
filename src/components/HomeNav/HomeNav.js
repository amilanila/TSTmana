import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import Junior from '../Junior';
import Senior from '../Senior';

export const HomeNav = () => {
	return (
		<Tabs>
			<Tab label="Juniors">
				<Junior/>
			</Tab>
			<Tab label="Seniors">
				<Senior/>
			</Tab>
		</Tabs>
	);
};

export const propTypes = HomeNav.propTypes = {
	shouldPlaceOrder: PropTypes.bool
};

export default connect(
	state => ({
	})
)(HomeNav);
