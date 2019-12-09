import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

class ModalBox extends Component {
	constructor(props) {
		super(props);
		//this.handleChange = this.handleChange.bind(this);
	}

	render(props) {		
	    return (
	    	<div className="modal">
	    		<div className="modal-header">
	    			<button className="close-modal"></button>
	    			<h3 className="modal-title">{this.props.title}</h3>
	    		</div>
	    		<div className="modal-body">
	    			<div className="modal-message">{this.props.bodyContent}</div>
	    		</div>
	    	</div>
    	)
	}

}

export default ModalBox;