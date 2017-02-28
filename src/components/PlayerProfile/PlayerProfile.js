import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchPlayerProfile } from '../../redux/modules/playerprofile';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { List } from 'material-ui/List';
import { Table } from 'react-bootstrap';
import { BarChart } from 'react-easy-chart';

const baseStyles = {
	padding: 30
};


export class PlayerProfile extends Component {

	render() {
		const { info } = !!this.props.playerprofile && this.props.playerprofile;

		return (
			<div>
				<div style={ {...baseStyles} }>
					{!!info && !!info.length && !!info[0].id &&
						<Card>
							<CardHeader
								title={info[0].name}
								avatar="/images/avatar1.jpg"
							/>
							<CardText>
								Age: {info[0].birthday}<br/>
								Height: {info[0].height}<br/>
								Weight: {info[0].weight}<br/>
								Description: {info[0].description}<br/>
								Team: {info[0].team}<br/>
								Division: {info[0].division}<br/>
								Season: {info[0].season}
							</CardText>
						</Card>
					}
				</div>
				<div style={ {...baseStyles} }>
					{!!info && !!info.length &&
						<Table responsive>
							<thead>
						      <tr>
						        <th>Match</th>
						        <th>R</th>
						        <th>O</th>
						        <th>OB</th>
						        <th>W</th>
						        <th>RC</th>
						        <th>C</th>
						      </tr>
						    </thead>
						    <tbody>
							{info.map((player) =>
								<tr>
									<td>{player.match}</td>
									<td>{player.runs}</td>
									<td>{player.outs}</td>
									<td>{player.oversBowled}</td>
									<td>{player.wickets}</td>
									<td>{player.runsConceded}</td>
									<td>{player.contribution}</td>
						      	</tr>
							)}		
							</tbody>		
						</Table>
					}
				</div>
				<div style={ {...baseStyles} }>
					{!!info && !!info.length &&
						<BarChart
						    data={[
						      {x: 'A', y: 20},
						      {x: 'B', y: 30},
						      {x: 'C', y: 40},
						      {x: 'D', y: 20},
						      {x: 'E', y: 40},
						      {x: 'F', y: 25},
						      {x: 'G', y: 5}
						    ]}
						 />
					}
				</div>
			</div>
		);
	}
}

export const propTypes = PlayerProfile.propTypes = {
	playerprofile: PropTypes.object,
	fetchPlayerProfile: PropTypes.func.isRequired,
	selectedPlayer: PropTypes.object
};

export default connect(
	state => ({
		playerprofile: state.playerprofile
	}), {
		fetchPlayerProfile
	}
)(PlayerProfile);
