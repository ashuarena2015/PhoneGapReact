import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

class ModalBox extends Component {
	constructor(props) {
		super(props);
	}

	render(props) {		
	    return (
	    	<div className={this.props.modalBoxClasses}>
	    		<div className="modal-body">
	    			<div className="modal-message">{this.props.children}</div>
	    		</div>
	    	</div>
    	)
	}

}

export default ModalBox;