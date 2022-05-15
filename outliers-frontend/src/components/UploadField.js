import * as React from 'react';
import Button from '@mui/material/Button';
import Papa from 'papaparse';



export default function UploadField({handleUpdate}) {
  
	const fileInput = React.useRef(null);
	const handleClick = event => {
		fileInput.current.click();
	};

	function queryTsApi(inputArray){

		var xhr = new XMLHttpRequest();
		const REACT_ENV = process.env.REACT_ENV;
		if (REACT_ENV=="PROD"){
			xhr.open("POST", "https://api.sarem-seitz.com/anomalies/forecast",true)
		}else{
			xhr.open("POST", "http://localhost:8081/forecast",true);
		}
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify({values: inputArray}));
		xhr.onload = function(){
			var data = JSON.parse(this.responseText);
			handleUpdate(data.values,data.probabilities)

		}


	}

	const fileHandler = event => {
		const csv = event.target.files[0];
		Papa.parse(csv, {complete: function(results) {
			const dataParsed = results["data"].map(x=>parseFloat(x[0]));
			queryTsApi(dataParsed);	
		}});

	};

  return (
	  <div>
	  <input
		ref={fileInput}
	  	onChange={fileHandler}
		type="file"
		style={{ display: 'none' }}
	  />
	  	<label htmlFor="button-uploader">
			<Button
	  			variant = "contained"
	  			onClick = {handleClick}
	  			style = {{backgroundColor: "green"}}
	  		>
	  		Upload  
	  		</Button>
	  	</label>
	  </div>
  );
}
