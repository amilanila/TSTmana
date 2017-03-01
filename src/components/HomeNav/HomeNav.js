import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import Player from '../Player';
import PlayerProfile from '../PlayerProfile';
import { Grid, Row, Col } from 'react-bootstrap';

export const HomeNav = () => {
	return (
		<Grid>
			<Row className="show-grid">
				<Col xs={12} md={4} className="">
					<Player/>
				</Col>
				<Col xs={12} md={8}>
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
