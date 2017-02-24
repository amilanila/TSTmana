import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from '../Header';
import Footer from '../Footer';
import TopBanner from '../TopBanner';
import HomeNav from '../HomeNav';

export const Home = () => {
	return (
		<div>
			<Header/>
			{/* <TopBanner/> */}
			<HomeNav/>
			<Footer/>
		</div>
	);
};

export const propTypes = Home.propTypes = {
	shouldPlaceOrder: PropTypes.bool
};

export default connect(
	state => ({
	})
)(Home);
