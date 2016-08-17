import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import Junior from '../Junior';

export const HomeNav = () => {
	return (
		<Tabs>
			<Tab label="Juniors">
				<Junior/>
			</Tab>
			<Tab label="Seniors">
				<div>
					<h2>Tab Two</h2>
				</div>
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
