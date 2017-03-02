import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';

const baseStyles = {
};

export class StatTable extends Component {

	render() {
		let info = this.props.info;

		return (
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
		);
	}
}

export const propTypes = StatTable.propTypes = {
	info: PropTypes.object
};

export default StatTable;
