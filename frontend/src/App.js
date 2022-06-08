import logo from './logo.svg';
import './App.css';
import MyAppBar from './components/MyAppBar';
import ProAppBar from './components/ProAppBar';
import Anomalies from './pages/Anomalies';
import SentimentStream from './pages/SentimentStream';
import Temperatures from './pages/Temperatures';
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
  const [titleSentimentState, setTitleSentimentState] = React.useState({"min": {"title":null,"avg_sentiment": 0.0, "count":null},
  									"max": {"title":null,"avg_sentiment": 0.0, "count":null},
  									"countmax": {"title":null,"avg_sentiment": 0.0, "count":null}});

  const REACT_ENV = process.env.REACT_APP_REACT_ENV;
  var socketUrl = null
  
  if (REACT_ENV === "PROD"){
  	socketUrl = "wss://api.sarem-seitz.com/sentiment-stream/socket";
  }else{
	socketUrl = "ws://localhost:8765";
  }
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  React.useEffect(() => {
   
	  
    if (lastMessage !== null) {
      const data = lastMessage.data;
      const parsed = JSON.parse(data);
      const sentiment_mean = parsed["sentiment_mean"];
      const title_sentiment = parsed["title_sentiment"];
      
      setTitleSentimentState((prev) => title_sentiment);

      const parsed_with_time = sentiment_mean.map(d => Object.assign({}, d, {"time":new Date(d["timestamp"]*1000)}));
      
      if (sentimentStreamState.length !== parsed_with_time.length){
      	setSentimentStreamState((prev) => parsed_with_time);
      }else if ((sentimentStreamState.length === parsed_with_time.length) && (setSentimentStreamState[sentimentStreamState.length-1]!==parsed_with_time[parsed_with_time.length-1])){
	setSentimentStreamState((prev) => parsed_with_time);
      }
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
						titleSentiment={titleSentimentState}
						updateState={1}
	  				/>
				}/>
	  			
	  			<Route path="/temperatures" element={
					<Temperatures REACT_ENV={REACT_ENV}/>
				}/>

	  		</Routes>
	  		
	  	</main>
	  	</BrowserRouter>
	</div>
  );
}

export default App;
