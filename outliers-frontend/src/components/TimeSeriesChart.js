import { Chart } from 'react-google-charts';
import * as React from 'react';


export default function TimeSeriesChart({data}){
	var chartData = [["Index", "Data"]];

	for (let i = 1; i <= data.length; i++){
		chartData.push([i, data[i]])
	};

	const options = {
		title: "Data",
		curveType: "function",
		legend: { position: "bottom" },
		animation: {
			duration: 500,
			easing: "out",
			startup: true
		}
	};
	return(
		<Chart
			chartType="LineChart"
			width="100%"
			height="400px"
			data={chartData}
			options={options}
		/>	
	)
}
