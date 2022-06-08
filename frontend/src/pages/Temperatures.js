import * as React from 'react';
import SensorChart from '../components/SensorChart';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import useWebSocket, { ReadyState } from 'react-use-websocket';


const explainImg = require("../assets/img/sentiment-stream-img.jpg")

export default function Temperatures({ REACT_ENV }){

	const [state, setState] = React.useState([]);
	
	var socketUrl = null;

	if (REACT_ENV === "PROD"){
  		socketUrl = "wss://api.sarem-seitz.com/temperatures/socket";
 	}else{
		socketUrl = "ws://localhost:8764/ws";
  	}

	const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
	React.useEffect(() => {
   
	  
		if (lastMessage !== null) {
			const data = lastMessage.data;
			const parsed = JSON.parse(data)["temperature_data"];
			      

			const parsed_with_time = parsed.map(d => Object.assign({},d,{"time":new Date(d["timestamp"]*1000)}));
			console.log(state)
	      
			if (state.length !== parsed_with_time.length){
				setState((prev) => parsed_with_time);
			}			
		}
    
  	}, [lastMessage, setState]);

	return(
	<div>
		<Box sx={{ flexGrow: 1 }}>
			<h1>Temperature and humidity measurement from live sensor</h1>
			<hr style={{opacity: 0.5, marginBottom: "30px"}}/>
			<Grid 
				container 
				spacing={2}
				alignItems="center"
				justifyContent="center"
			>
				<Grid item xs={12} md={12}>
					<Paper elevation={3}>
						<SensorChart
							data={state.map(x => ({"index": x["time"], "value": x["temperature"]}))} 
						/>
					</Paper>
				</Grid>
				

			</Grid>
			
					</Box>
	</div>
	)
	
}



