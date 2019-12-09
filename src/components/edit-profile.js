import React, { Component } from 'react';
import { Redirect, Link} from "react-router-dom";
import history from './history';

class EditProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sessionUser : localStorage.getItem('sessionUser'),
			fullname:'',
			loading: true,
			changeName: false,
			currName: true,
			changeNumber: false,
			newNumber: '',
			otpField: false,
			getOTP: '',
			showOTPForm: false,
			failedOTP: '',
			existingNumber: true,
			sucMsgMobileUpdate: false,
			failMsgMobileUpdate: false,
			failMsgNameUpdate: false,
			sucMsgNameUpdate: false,
		}

		this.verifyNumber = this.verifyNumber.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.sendOTPverifyNumber = this.sendOTPverifyNumber.bind(this);
		this.sendOTPverifyNumberCancel = this.sendOTPverifyNumberCancel.bind(this);
		this.saveName = this.saveName.bind(this);
		this.saveNameCancel = this.saveNameCancel.bind(this);
		this.updateName = this.updateName.bind(this);
		this.updateNumber = this.updateNumber.bind(this);

		if(localStorage.getItem('sessionUser') == '' || localStorage.getItem('sessionUser') == null){
			history.push('/');
		}
    
	}

	updateName(){
		this.setState({
			changeName: true,
			currName: false
		})
	}

	saveNameCancel(){
		this.setState({
			changeName: false,
			currName: true
		})
	}

	saveName(){

		var newName = this.refs.newName.value;

		fetch(`${WS_URL}update-name.php`, {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: 'newName='+newName+'&user_id='+localStorage.getItem('userId'),
	      }).then(response => {
	        return response.json();
	      }).then(json => {
	      		this.setState({
	      			statusUpdateName: json.status,
	      		})

	      		if(this.state.statusUpdateName > 0){

	      			this.setState({
	      				sucMsgNameUpdate: true,
	      				failMsgNameUpdate: false,
	      				newName: newName
	      			});

	      			setTimeout(function() {
				     	history.push('/profile');   
				    }.bind(this),3000);

	      		}else {
	      			this.setState({
	      				sucMsgNameUpdate: false,
	      				failMsgNameUpdate: true
	      			});
	      		}

	      });
	}

	verifyNumber(){
		this.setState({
			existingNumber: false,
			changeNumber: true
		})
	}

	sendOTPverifyNumberCancel(){
		this.setState({
			existingNumber: true,
			changeNumber: false
		})
	}

	sendOTPverifyNumber(){

		var newMobile = this.refs.newNumber.value;
		var currMobile = this.refs.curNumber.value;

		this.setState({newNumber : this.refs.newNumber.value, otpField : true});

		fetch(`${WS_URL}send-otp-mobile-verify.php`, {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: 'currMobile='+currMobile+'&newMobile='+newMobile+'&user_id='+localStorage.getItem('userId'),
	      }).then(response => {
	        return response.json();
	      }).then(json => {
	      		
	      		this.setState({
	      			loading: false,
	      			getOTP: json.otp,
	      			showOTPForm: true,
	      			failedOTP: json.status
	      		})

	      		if(json.status == 'failure'){
	      			console.log(json.status);
	      			this.setState({
	      				changeNumber: false,
	      				existingNumber: true,
	      				otpField: '',
	      				showOTPForm: false
	      			})
	      		}

	      });
	}

	updateNumber(){

		var newNumber = this.refs.newNumber.value;
		var otpMobile = this.refs.otpMobile.value;

		fetch(`${WS_URL}update-mobile.php`, {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: 'newMobile='+newNumber+'&otp='+otpMobile+'&user_id='+localStorage.getItem('userId'),
	      }).then(response => {
	        return response.json();
	      }).then(json => {
	      		this.setState({
	      			statusUpdateNumber: json.status,
	      		})

	      		if(this.state.statusUpdateNumber > 0){

	      			this.setState({
	      				sucMsgMobileUpdate: true,
	      				failMsgMobileUpdate: false
	      			});

	      			setTimeout(function() {
				     	history.push('/profile');   
				    }.bind(this),3000);

	      		}else {
	      			this.setState({
	      				sucMsgMobileUpdate: false,
	      				failMsgMobileUpdate: true
	      			});
	      		}

	      });
	}

	handleChange(target) {
		this.setState({[target.name]: e.target.value});
	}

	componentDidMount(){
		fetch(`${WS_URL}profile.php`, {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: 'email='+localStorage.getItem('sessionUser')+'&user_id='+localStorage.getItem('userId'),
	      }).then(response => {
	        return response.json();
	      }).then(json => {
	      		this.setState({
	      			fullname: json[0].name,
	      			email: json[0].email,
	      			mobile: json[0].mobile,
	      			userId: json[0].id,
	      			prevProfileImg:json[0].profile_img,
	      			imageCamp: json[0].imageCamp,
	      			smsCamp: json[0].smsCamp,
	      			designCamp: json[0].designCamp, 
	      			loading: false
	      		})

	      });
	}


	render(props) {

	    return (
	    	<div className="container vertical-center-box">

		    	<div className="panel panel-default transparent-bg-box profile-page">
		    		<div className="panel-body">
		    			<h3>Edit profile</h3>
		    			<div className={this.state.loading ? 'text-center' : 'hide'}>
	    					<span className="fa fa-spin fa-spinner fa-3x m-t-rg"></span>
    					</div>
    					
    					<div className={this.state.sucMsgMobileUpdate  ? "alert alert-success m-b-rg" : "hide"}>
    						Your mobile has been updated successfully.
    					</div>

    					<div className={this.state.failMsgMobileUpdate  ? "alert alert-error m-b-rg" : "hide"}>
    						Your request for mobile update has been failed, please try again.
    					</div>

    					<div className={this.state.sucMsgNameUpdate  ? "alert alert-success m-b-rg" : "hide"}>
    						Your name has been updated successfully.
    					</div>

    					<div className={this.state.failMsgNameUpdate  ? "alert alert-error m-b-rg" : "hide"}>
    						Your request for name update has been failed, please try again.
    					</div>

						<div className="form-box m-b-lg">
							<ul>
			    				<li className={this.state.currName ? "pos-rel" : "hide"}>
			    					<span className="label">Full name</span>
			    					<input name="fullName" readonly className="form-control" value={this.state.fullname} />
			    					<a href="javascript:void(0)" onClick={this.updateName} style={{'position': 'absolute','top': '-2px','right': '0', 'color': 'cornflowerblue','text-decoration': 'underline', 'font-size': '13px'}}>Update</a>
			    				</li>
			    				<li className={this.state.changeName ? "pos-rel" : "hide"}>
			    					<span className="label">Full name</span>
			    					<input onChange={ this.handleChange } name="newName" ref="newName" className="form-control" value={this.state.newName} />
			    					<a href="javascript:void(0)" onClick={this.saveName} style={{'position': 'absolute','top': '-2px','right': '55px', 'color': 'cornflowerblue','text-decoration': 'underline', 'font-size': '13px'}}>Save</a>
			    					<a href="javascript:void(0)" onClick={this.saveNameCancel} style={{'position': 'absolute','top': '-2px','right': '0', 'color': 'red','text-decoration': 'underline', 'font-size': '13px'}}>Cancel</a>
			    				</li>
			    				<li className="m-t-rg">
			    					<span className="label">Email<span className="hint-text dis-block">(you can't change registered email)</span></span>
			    					<input className="form-control" readonly value={this.state.email} />
		    					</li>
		    					<li className={this.state.existingNumber ? "pos-rel show m-t-rg" : "hide"}>
			    					<span className="label">Mobile<span className="hint-text dis-block">(you have to verfiy number, if you change)</span></span>
			    					<input ref="curNumber" name="curNumber" readonly className="form-control" value={this.state.mobile} />
			    					<a href="javascript:void(0)" onClick={this.verifyNumber} style={{'position': 'absolute','top': '0px','right': '0', 'color': 'cornflowerblue','text-decoration': 'underline', 'font-size': '13px'}}>New number</a>
			    					<span className={this.state.failedOTP == 'failure' ? 'hint-text dis-block' : 'hide'} style={{'color':'red'}}>Failed to generate otp, please try again.</span>
		    					</li>
		    					<li className={this.state.changeNumber ? "show pos-rel m-t-rg" : "hide"}>
			    					<span className="label">New mobile<span className="hint-text dis-block">(OTP will be provided on this number.)</span></span>
			    					<a href="javascript:void(0)" onClick={this.sendOTPverifyNumber} style={{'position': 'absolute','top': '0','right': '55px', 'color': 'cornflowerblue','text-decoration': 'underline', 'font-size': '13px'}}>Send OTP</a>
			    					<a href="javascript:void(0)" onClick={this.sendOTPverifyNumberCancel} style={{'position': 'absolute','top': '0px','right': '0', 'color': 'red','text-decoration': 'underline', 'font-size': '13px'}}>Cancel</a>
			    					<input ref="newNumber" name="newNumber" placeholder="New number here" className="form-control" onChange={ this.handleChange } value={this.state.newNumber} />
		    					</li>
		    					<li className={this.state.showOTPForm ? "show pos-rel m-t-rg" : "hide"}>
			    					<span className="label">Enter OTP</span>
			    					<input className="form-control" placeholder="XXXX" ref="otpMobile" name="otpMobile" onChange={ this.handleChange } value="" />
			    					<a href="javascript:void(0)" onClick={this.updateNumber} style={{'position': 'absolute','top': '0px','right': '2px', 'color': 'cornflowerblue','text-decoration': 'underline', 'font-size': '13px'}}>Update</a>
		    					</li>
	    					</ul>
		    			</div>

		    			<div className="text-center m-b-lg">
	    					<Link to={`/profile`} className="btn btn-purple-o">Exit now</Link>
    					</div>

					</div>
		    	</div>
	    	</div>
    	)
	}

}

export default EditProfile;