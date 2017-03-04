import React, { Component, PropTypes } from 'react';
import { BarChart } from 'react-easy-chart';

const baseStyles = {
};

export class ScoreBarChart extends Component {

	constructor(props) {
		super(props);

		this.state = {
			height: window.innerHeight,
			width: window.innerWidth
		}

		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}

	componentDidMount() {
		this.updateWindowDimensions();
	  	window.addEventListener('resize', this.updateWindowDimensions.bind(this));
	}

	componentWillUnmount() {
	  	window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
	}

	updateWindowDimensions() {
	  	this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

	render() {
		let graphData = this.props.graphData;
		let maxY = 0;
		if (!!graphData && !!graphData.length) {
			for (let data of graphData) {
				if (maxY < data.y) {
					maxY = data.y;
				}
			}
		}
		
		return (
			<div style={ {...baseStyles} }>
				{!!graphData && !!graphData.length &&
					<BarChart
					    axisLabels={{x: 'Game', y: 'Score', y2: ' '}}
					    axes
					    grid
					    colorBars
					    height={200}
					    width={this.state.width}
					    xDomainRange={[1, 15]}
						yDomainRange={[0, (maxY + 15)]}
						interpolate={'cardinal'}
						y2Type="linear"
					    data={graphData}
					    lineData={graphData}
					 />
				}
			</div>
		);
	}
}

export const propTypes = ScoreBarChart.propTypes = {
	graphData: PropTypes.object
};

export default ScoreBarChart;
