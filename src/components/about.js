import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

class About extends Component {
	constructor(props) {
		super(props);
	}

	render(props) {
	    return (
	    	<div className="container m-t-50">
		    	<div className="panel panel-default">
		    		<div className="panel-body">
		    			<h3>About app</h3>
		    			<p>Here, you can create and send Image and SMS campaign. We have also a designing tool which help you to design your campaign with images and content.</p>
	    			</div>
    			</div>
			</div>
    	)
	}

}

export default About;