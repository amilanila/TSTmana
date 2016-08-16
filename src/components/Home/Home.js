import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TopBanner from '../TopBanner';
import HomeNav from '../HomeNav';

export const Home = () => {
	return (
		<div>
			<TopBanner/>
			<HomeNav/>
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
