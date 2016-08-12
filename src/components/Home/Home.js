import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

export const Home = () => {
	return (
		<div>
			Home page
		</div>
	);
};

export const propTypes = Home.propTypes = {
	shouldPlaceOrder: PropTypes.bool
};

export default connect(
	state => ({
		containsDigitalEntriesOnly: state.cartSummary.containsDigitalEntriesOnly
	})
)(Home);
