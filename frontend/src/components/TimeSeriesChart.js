import { Chart } from 'react-google-charts';
import * as React from 'react';


export default function TimeSeriesChart({data}){
	var chartData = [["Time", "Sentiment"]];

	if (data.length == 0){
		chartData.push([1,1 ])
	}

	for (let i = 0; i < data.length; i++){
		chartData.push([data[i]["index"], data[i]["value"]])
	};

	const options = {
		title: "15 minutes rolling sentiment score",
		curveType: "function",
		legend: { position: "none" },
		animation: {
			duration: 500,
			easing: "out",
			startup: true
		},
		vAxis: {
			viewWindow: {
				min: -1.0,
				max: 1.0
			}
		}
	};
	return(
		<Chart
			chartType="LineChart"
			width="70vw"
			height="40vh"
			data={chartData}
			options={options}
		/>	
	)
}
