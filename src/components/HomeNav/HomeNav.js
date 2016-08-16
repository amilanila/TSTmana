import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Nav, NavItem } from 'react-bootstrap';

export const HomeNav = () => {
	return (
		<Nav bsStyle="tabs" activeKey="1">
			<NavItem eventKey="1" href="/tmana/home">U11</NavItem>
			<NavItem eventKey="1" href="/tmana/home">Senior</NavItem>
		</Nav>
	);
};

export const propTypes = HomeNav.propTypes = {
	shouldPlaceOrder: PropTypes.bool
};

export default connect(
	state => ({
		containsDigitalEntriesOnly: state.cartSummary.containsDigitalEntriesOnly
	})
)(HomeNav);
