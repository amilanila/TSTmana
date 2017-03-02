import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Grid, Row, Col } from 'react-bootstrap';
import Players from '../Players';
import PlayerProfile from '../PlayerProfile';
import ContribPieChart from '../ContribPieChart';

export const HomeNav = () => {
	return (
		<Grid>
			<Row className="show-grid">
				<Col xs={12} md={4}>
					<Players/>
				</Col>
			</Row>
			<Row className="show-grid">
				<Col xs={12} md={12}>
					<PlayerProfile/>
				</Col>
			</Row>
		</Grid>		
	);
};

export const propTypes = HomeNav.propTypes = {
	shouldPlaceOrder: PropTypes.bool
};

export default connect(
	state => ({
	})
)(HomeNav);
