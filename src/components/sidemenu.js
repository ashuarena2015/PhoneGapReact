import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import history from './history';



class SideMenu extends Component {

	constructor(props) {
		super(props);
		this.logout = this.logout.bind(this);
	}

	logout(){
		localStorage.removeItem('sessionUser');
		localStorage.removeItem('userId');
		history.push('/');
	}


	render(){

		const loginLogoutBtn = this.props.loggedInOut;

		return(
			<div className="header">
				<div id="sidemenu">
					<a href="#" className={!this.props.sideMenuOpen ? "menu-opener" : "menu-opener menu-opener-active"} onClick={this.props.menuOpener}><span className={!this.props.sideMenuOpen ? "fa fa-bars fa-2x" : "fa fa-arrow-left"}></span></a>
				      <div className={!this.props.sideMenuOpen ? "side-menu side-menu-hide" : "side-menu side-menu-open"}>
				        <ul onClick={this.props.menuOpener}>
				            <li><Link to='/profile'>My Profile</Link></li>
				            <li><Link to='/create-campaign'>Create Campaign</Link></li>
				            <li><Link to='/my-campaigns'>My Campaigns</Link></li>
										<li><Link to='/import-contacts'>Import Contacts</Link></li>
				            <li><Link to='/about'>About Us</Link></li>
				            <li className="divider"></li>
				            {loginLogoutBtn != '' && 
				            	<li><Link to='' onClick={this.logout}>Logout</Link></li>
				            }
				            {loginLogoutBtn == ''  && 
				            	<li><Link to='' onClick={this.logout}>Login</Link></li>
				            }
				        </ul>
				  	</div>
			  	</div>
		  	</div>

  		)
  	}

}

export default SideMenu;