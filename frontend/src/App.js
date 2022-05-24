import logo from './logo.svg';
import './App.css';
import MyAppBar from './components/MyAppBar';
import ProAppBar from './components/ProAppBar';
import Anomalies from './pages/Anomalies';
import SentimentStream from './pages/SentimentStream';
import Home from './pages/Home';
import * as React from 'react';
import './styles/App.scss';
import MenuIcon from '@mui/icons-material/Menu'; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useWebSocket, { ReadyState } from 'react-use-websocket';


const anomalies_preset = JSON.parse(
	JSON.stringify(
		require("./assets/data/anomalies_preset.json")
	)
)

function App() {
  
  const [state, setState] = React.useState({
	  anomalies: anomalies_preset,
  }); 
  
  function updateTsData(newValues, newProbs) {
	setState({anomalies: {values: newValues, probabilities: newProbs}})
  }

  const [toggled, setToggled] = React.useState(false);
  const handleToggleSidebar = (value) => {
  	setToggled(value);
  };

  

  const [sentimentStreamState, setSentimentStreamState] = React.useState([]);

  const socketUrl = "ws://localhost:5432"
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  React.useEffect(() => {
   
	  
    if (lastMessage !== null) {
      const data = lastMessage.data;
      const parsed = JSON.parse(data.substr(1,data.length-2).replaceAll('\\',''));
      parsed["time"] = new Date(parsed["timestamp"] * 1000); 
      setSentimentStreamState((prev) => prev.concat((parsed)));
    console.log(sentimentStreamState)
    }
  }, [lastMessage, setSentimentStreamState]);

  
  return (
    	<div className="app">
	  	<BrowserRouter>
      		<ProAppBar
			toggled={toggled}
	  		handleToggleSidebar={handleToggleSidebar}
	  	/>
	  	<div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        		<MenuIcon />
      		</div>
	  	<main>
	  		<Routes>
	  			<Route path="/" element={
					<Home 
	  					state={state}
						updateState={updateTsData}
	  				/>
				}/>

	  			<Route path="/anomalies" element={
					<Anomalies 
	  					state={state}
						updateState={updateTsData}
	  				/>
				}/>

	  			<Route path="/sentiment-streaming" element={
					<SentimentStream
	  					state={sentimentStreamState}
						updateState={1}
	  				/>
				}/>

	  		</Routes>
	  		
	  	</main>
	  	</BrowserRouter>
	</div>
  );
}

export default App;
