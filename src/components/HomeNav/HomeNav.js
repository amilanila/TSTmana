import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchPlayers } from '../../redux/modules/player';
import { fetchPlayersStat } from '../../redux/modules/playersStat';
import { Grid, Row, Col } from 'react-bootstrap';
import Players from '../Players';
import PlayerProfile from '../PlayerProfile';
import ContribPieChart from '../ContribPieChart';

export class HomeNav extends Component {

	componentDidMount() {
		this.props.fetchPlayers();
		this.props.fetchPlayersStat();
	}

	render() {
		const { list } = this.props.players;
		const { stats } = this.props.playersStat;

		const playersTotalRunsMap = new Map();
		const playersTotalWicketsMap = new Map();
		const playersTotalRunsConcededMap = new Map();
		const playersTotalContributionMap = new Map();
		
		if (!!list && !!list.length && !!stats && !!stats.length) {
			for (let member of list) {

				let totalRuns = 0;
				let totalWickets = 0;
				let totalRunsConceded = 0;
				let totalContribution = 0;

				for (let player of stats) {
					if (member.id === player.id) {

						totalRuns += player.runs;
						totalWickets += player.wickets;
						totalRunsConceded += player.runsConceded;
						totalContribution += player.contribution;
					}
				}

				let fullName = member.name;
				let firstName = fullName.substr(0, fullName.indexOf(' '));

				// Runs
				playersTotalRunsMap.set(firstName, totalRuns);

				// Wickets
				playersTotalWicketsMap.set(firstName, totalWickets);
				
				// Runs conceded
				playersTotalRunsConcededMap.set(firstName, totalRunsConceded);
				
				// Contribution
				playersTotalContributionMap.set(firstName, totalContribution);
			}
		}

		return (
			<Grid>
				<Row className="show-grid">
					<Col xs={12} md={4}>
						<Players list={list}/>
					</Col>
					<Col xs={12} md={8}>
						<Row className="show-grid">
							<Col xs={12} md={6}>
								{!!playersTotalRunsMap && !!playersTotalRunsMap.size &&
									<ContribPieChart data={playersTotalRunsMap} title='Runs'/>
								}
							</Col>
							<Col xs={12} md={6}>
								{!!playersTotalWicketsMap && !!playersTotalWicketsMap.size &&
									<ContribPieChart data={playersTotalWicketsMap} title='Wickets'/>
								}
							</Col>
						</Row>
						<Row className="show-grid">
							<Col xs={12} md={6}>
								{!!playersTotalRunsConcededMap && !!playersTotalRunsConcededMap.size &&
									<ContribPieChart data={playersTotalRunsConcededMap} title='Runs Conceded'/>
								}
							</Col>
							<Col xs={12} md={6}>
								{!!playersTotalContributionMap && !!playersTotalContributionMap.size &&
									<ContribPieChart data={playersTotalContributionMap} title='Contribution'/>
								}
							</Col>
						</Row>						
					</Col>
				</Row>
				<Row className="show-grid">
					<Col xs={12} md={12}>
						<PlayerProfile/>
					</Col>
				</Row>
			</Grid>		
		);	
	}
	
};

export const propTypes = HomeNav.propTypes = {
	fetchPlayers: PropTypes.func.isRequired,
	fetchPlayersStat: PropTypes.func.isRequired,
	players: PropTypes.object,
	playersStat: PropTypes.object
};

export default connect(
	state => ({
		players: state.player,
		playersStat: state.playersStat
	}),	{
		fetchPlayers,
		fetchPlayersStat
	}
)(HomeNav);