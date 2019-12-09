import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";
import history from './history';

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sessionUser2 : localStorage.getItem('sessionUser'),
			fullname:'',
			file: '',
			imagePreviewUrl: '',
			uploadImgBtn: false,
			cancelImg: false,
			uploadImgMsg: false,
			prevProfileImg: '',
			openImageSelector: false,
			changePicOption: true,
			loading: true
		}

		this.cancelImgUpload = this.cancelImgUpload.bind(this);
		this.openImageSelector = this.openImageSelector.bind(this);
		this.goToImageCampaigns = this.goToImageCampaigns.bind(this);

		if(localStorage.getItem('sessionUser') == '' || localStorage.getItem('sessionUser') == null){
			history.push('/');
		}
    
	}


	openImageSelector(){
		this.setState({
			openImageSelector: true,
			changePicOption: false
		})
	}

	_handleSubmit(e) {
	    e.preventDefault();
	    if(this.state.imagePreviewUrl){	
      			fetch(`${WS_URL}profile-image.php`, {
			      method: 'POST',
			      headers: {
			        'Content-Type': 'application/x-www-form-urlencoded'
			      },
			      body: 'profile-image='+this.state.imagePreviewUrl+'&user-id='+this.state.userId,
			      }).then(response => {
			        return response.json();
			      }).then(json => {
			          	if(json==1){
			          		this.setState({
			          			uploadImgBtn: false,
	        					cancelImg: false,
	        					uploadImgMsg: true,
	        					changePicOption: true,
	        					openImageSelector: false
			          		})
			          	}
			      });
	  		}
	  }

	  _handleImageChange(e) {
	    e.preventDefault();

	    let reader = new FileReader();
	    let file = e.target.files[0];

	    reader.onloadend = () => {
	      this.setState({
	        file: file,
	        imagePreviewUrl: reader.result,
	        uploadImgBtn: true,
	        cancelImg: true,
	        uploadImgMsg: false,
	        openImageSelector: false
	      });
	    }

	    reader.readAsDataURL(file)
	  }

	  cancelImgUpload(){
	  	this.setState({
	        imagePreviewUrl: '',
	        uploadImgBtn: false,
	        cancelImg: false,
	        changePicOption: true
	      });
	  }

	logout(){
		localStorage.removeItem('sessionUser');
		localStorage.removeItem('userId');
		const currentUser = localStorage.getItem('sessionUser');
		if(currentUser == 'undefined' || currentUser ==''){
			history.push('/');
		}else{
			history.push('/');
		}
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


	goToImageCampaigns(){
		history.push('/my-campaigns/#0');
	}
	goToSMSCampaigns(){
		history.push('/my-campaigns/#1');
	}
	goToDesignCampaigns(){
		history.push('/my-campaigns/#2');
	}


	render(props) {

		const self = this;

		let {imagePreviewUrl} = this.state;
		 let prevProfileImg  = `${WS_URL}${this.state.prevProfileImg}`;
	    let $imagePreview = null;
	    if (imagePreviewUrl) {
	      $imagePreview = (<img src={imagePreviewUrl} />);
	    } else {
	      $imagePreview = (<img src={prevProfileImg} />);
	    }

	    return (
	    	<div className="container vertical-center-box">

		    	<div className="panel panel-default transparent-bg-box profile-page">
		    		<div className="panel-body">
		    			<div className={this.state.loading ? 'text-center' : 'hide'}>
	    					<span className="fa fa-spin fa-spinner fa-3x m-t-rg"></span>
    					</div>
			    		<div className="profile-img">
			    			{$imagePreview}
			    			<div className="photo-edit">
			    				<span className="fa fa-camera"></span>
								<input className="fileInput" type="file" className="" onChange={(e)=>this._handleImageChange(e)} />
							</div>
						</div>
			    		<div className="previewComponent text-center">
					        <form onSubmit={(e)=>this._handleSubmit(e)}>
					        	{/*<a href="javascript:void(0)" onClick={this.openImageSelector} className={!this.state.changePicOption ? "hide" : "text-info m-t-xs"}>Change picture</a>*/}
					        	<p className={this.state.uploadImgMsg ? "show" : "hide"}>Profile picture upload successfully!</p>
								<div className="btn-group" style={{'margin-top':'5px'}}>
									<button className={this.state.uploadImgBtn ? "btn btn-sm btn-success" : "hide"} type="submit" onClick={(e)=>this._handleSubmit(e)}>Upload</button>
									<button onClick={this.cancelImgUpload} className={this.state.cancelImg ? "btn btn-sm btn-danger" : "hide"}>Cancel</button>
								</div>
							</form>
						</div>

						<div className="panel-row panel-row-group m-t-rg m-b-rg">
			    			<div className="row-item">
			    				<span className="fa fa-user fa-stack label"></span>
			    				<span className="label-value">{this.state.fullname}</span>
		    				</div>
		    				<div className="row-item">
			    				<span className="fa fa-envelope fa-stack label"></span>
			    				<span className="label-value">{this.state.email}</span>
		    				</div>
		    				<div className="row-item">
			    				<span className="fa fa-phone fa-stack label"></span>
			    				<span className="label-value">{this.state.mobile}</span>
		    				</div>
		    			</div>

		    			<div className="text-center m-b-lg">
	    					<Link to={`/edit-profile/${this.state.userId}/`} className="btn btn-purple-o">Edit profile</Link>
    					</div>

		    			<div className="panel-row panel-row-group m-t-rg m-b-rg">
			    			<div onClick={this.goToImageCampaigns} className="row-item" style={{'background':'#66a430', 'color': '#fff','border':'none'}}>
			    				<span className="fa fa-user fa-envelope fa-stack label"></span>
			    				<span className="label-value">Image campaigns</span>
			    				<div className="counts">{this.state.imageCamp}</div>
			    				<span className="fa fa-stack fa-arrow-right goto-link"></span>
		    				</div>
		    				<div onClick={this.goToSMSCampaigns} className="row-item" style={{'background':'#3065a4', 'color': '#fff','border':'none'}}>
			    				<span className="fa fa-comment fa-stack label"></span>
			    				<span className="label-value">SMS campaigns</span>
			    				<div className="counts">{this.state.smsCamp}</div>
			    				<span className="fa fa-stack fa-arrow-right goto-link"></span>
		    				</div>
		    				<div onClick={this.goToDesignCampaigns} className="row-item" style={{'background':'#e66730', 'color': '#fff','border':'none'}}>
			    				<span className="fa fa-paint-brush fa-stack label"></span>
			    				<span className="label-value">Design campaigns</span>
			    				<div className="counts">{this.state.designCamp}</div>
			    				<span className="fa fa-stack fa-arrow-right goto-link"></span>
		    				</div>
		    			</div>

					</div>
		    	</div>
	    	</div>
    	)
	}

}

export default Profile;