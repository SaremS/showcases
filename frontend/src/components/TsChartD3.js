import * as React from 'react';
import * as d3 from "d3";
import { useD3 } from '../hooks/d3Hook';



export default function TsChartD3({input, probs}){

	const data = []

	for (let i = 0; i < input.length; i++){
		data.push({"id":i+1, "value": input[i], "prob": probs[i]})
	}

	const ref = useD3(
    		(svg) => {
      	      const height = 500;
	      const width = 1200;
	      const margin = { top: 20, right: 30, bottom: 30, left: 40 };

		svg.select(".plot-area")
    		.attr("width", width + margin.left + margin.right)
    		.attr("height", height + margin.top + margin.bottom)
  		.append("g")
    		.attr("transform",
         	 "translate(" + margin.left + "," + margin.top + ")");

		var x = d3.scaleLinear()
      		.domain(d3.extent(data, function(d) { return d.id; }))
      		.range([ 0, width ]);
   		svg.select(".xAxis")
      		.attr("transform", "translate(0," + height + ")")
      		.call(d3.axisBottom(x));

    
    		var y = d3.scaleLinear()
      		.domain([0, d3.max(data, function(d) { return d.value; })])
      		.range([ height, 0 ]);
    		svg.select(".yAxis")
      		.call(d3.axisLeft(y));

	      svg
		.select(".plot-area")
		.datum(data)
		.attr("fill","none")
		.attr("stroke", "steelblue")
		.attr("stroke-width", 1.5)
		.attr("d", d3.line()
			.x(function(d) {return x(d.id)})
			.y(function(d) {return y(d.value)})
		)
	    },
	    [data.length]
	  );

	  return (
	    <svg
	      ref={ref}
	      style={{
		height: 500,
		width: "100%",
		marginRight: "0px",
		marginLeft: "0px",
	      }}
	    >
		  <g className="plot-area" />
		  <g className="xAxis" />
		  <g className="yAxis" />
	      

	    </svg>
	  );

		



	}
