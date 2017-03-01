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

class GraphDataEntry {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

export class PlayerProfile extends Component {

	render() {
		const { info } = !!this.props.playerprofile && this.props.playerprofile;
		const graphData = new Array();

		if (!!info && !!info.map) {
			info.map((player) => {
				let graphDataEntry = new GraphDataEntry(player.match, player.runs);
				graphData.push(graphDataEntry);
			});	
		}

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
						        <th>Game</th>
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
						    axisLabels={{x: 'Game', y: 'Score', y2: ' '}}
						    axes
						    grid
						    colorBars
						    height={250}
						    width={650}
						    xDomainRange={[1, 15]}
    						yDomainRange={[0, 20]}
    						interpolate={'cardinal'}
    						y2Type="linear"
						    data={graphData}
						    lineData={graphData}
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
