import logo from './logo.svg';
import './App.css';
import MyAppBar from './components/MyAppBar';
import ProAppBar from './components/ProAppBar';
import Anomalies from './pages/Anomalies';
import Home from './pages/Home';
import * as React from 'react';
import './styles/App.scss';
import MenuIcon from '@mui/icons-material/Menu'; 
import { BrowserRouter, Routes, Route } from "react-router-dom";

const anomalies_preset = JSON.parse(
	JSON.stringify(
		require("./assets/data/anomalies_preset.json")
	)
)

function App() {
  
  const [state, setState] = React.useState({
	  anomalies: anomalies_preset
  }); 
  
  const [toggled, setToggled] = React.useState(false);
  const handleToggleSidebar = (value) => {
  	setToggled(value);
  };
  
  function updateTsData(newValues, newProbs) {
	setState({anomalies: {values: newValues, probabilities: newProbs}})
  }

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
	  		</Routes>
	  		
	  	</main>
	  	</BrowserRouter>
	</div>
  );
}

export default App;
