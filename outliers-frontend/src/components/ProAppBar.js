import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent, SidebarFooter } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';

export default function ProAppBar({toggled, handleToggleSidebar}){

	return(
		<ProSidebar 
			toggled={toggled}
			onToggle={handleToggleSidebar}
			breakPoint="md"
		>
		  <SidebarHeader style={{textAlign: "center"}}>
			<h1>Showcases</h1>
		  </SidebarHeader>

		  <SidebarContent>
		  	<Menu iconShape="square">
				<MenuItem icon={<HomeIcon />}>
					<Link to="/">Home</Link>
				</MenuItem>
		  	</Menu>
		  


		  <Menu iconShape="square">
		    	<MenuItem icon={<SsidChartIcon />}>
				<Link to="/anomalies">Anomaly Detection</Link>
			</MenuItem>

		  </Menu>


		</SidebarContent>

		<SidebarFooter>
			<div
				className="sidebar-btn-wrapper"
				style={{
					padding: '20px 20px'
				}}
			>
				<p>&copy;2022 Sarem Seitz</p>
			</div>
		</SidebarFooter>
		</ProSidebar>
	)
}

