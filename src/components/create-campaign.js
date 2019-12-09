 import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import ModalBox from './modal-box';
import CSVReader from "react-csv-reader";
import history from './history';

class CreateCampaign extends Component {
	constructor(props) {
		super(props);
		this.state = {
			campaignTypeSelected: true,
			nextStep: false,
			chooseImageStep: false,
			chooseContactListStep: false,
			campaignName: null,
			campaignContent: '',
			sessionUser: localStorage.getItem('sessionUser'),
			userID: localStorage.getItem('userId'),
			fulldata: [],
			createNewList: false,
			listData: [],
			displayAllListContact:false,
			listToshow: false,
			items: {},
			modalBoxShow: false,
			campaignNameError: false,
			addNewModal: false,
			addNewListModalForm: true,
			addNewContactModalForm: false,
			displayedListsName:[],
			listId:'',
			contactCSV:'',
			emailCSV:[],
			emailListToshow: false,
			importCSV: false,
			campSendSuccess: false,
			smsInputStep: false,
			campaignSender: null,
			campaignSenderError: false,
			campSendSMSSuccess: false,
			designCampStep: false,
			chooseContactListStepDesign: false,
			loading: false,
			getPagePath: window.location.href,
			haveContactList: false,
			testSMSModal: false,
			testImageCampModal: false,
			imageCampTestSendSuc: false,
			selectedCampType: ''
		}


		this.campaignType = this.campaignType.bind(this);
		this.nextStepToContacts = this.nextStepToContacts.bind(this);
		this.getListData = this.getListData.bind(this);
		this.closeListToShow = this.closeListToShow.bind(this);
		this.listChecked = this.listChecked.bind(this);
		this.sendCampaignNow = this.sendCampaignNow.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.backToChooseImage = this.backToChooseImage.bind(this);
		this.backToChooseCampaignType = this.backToChooseCampaignType.bind(this);
		this.addNewListModalBox = this.addNewListModalBox.bind(this);
		this.addNewFormType = this.addNewFormType.bind(this);
		this.importEmailContacts = this.importEmailContacts.bind(this);
		this.handleForce = this.handleForce.bind(this);
		this.showSidePreviewContent = this.showSidePreviewContent.bind(this);
		this.closeAddNewModal = this.closeAddNewModal.bind(this);
		this.nextSMSStepToContacts = this.nextSMSStepToContacts.bind(this);
		this.sendSMSNow = this.sendSMSNow.bind(this);
		this.addList = this.addList.bind(this);
		this.backToSMSStep1 = this.backToSMSStep1.bind(this);
		this.sendTestSMS = this.sendTestSMS.bind(this);
		this.closeTestSMSModal = this.closeTestSMSModal.bind(this);
		this.sendTestSMSModal = this.sendTestSMSModal.bind(this);
		this.sendTestImageCampModal = this.sendTestImageCampModal.bind(this);
		this.closeTestImageCampModal = this.closeTestImageCampModal.bind(this);
		this.sendTestImageCamp = this.sendTestImageCamp.bind(this);

		if(localStorage.getItem('sessionUser') == '' || localStorage.getItem('sessionUser') == null){
			history.push('/');
		}

	}



	campaignType(e){
		const campaignType = e.target.value;
		this.setState({
			selectedCampType: campaignType
		})
		if(campaignType == 'send-image'){
			this.setState({
				campaignTypeSelected: false,
				chooseImageStep: true,
				designCampStep: false
			})
		}
		if(campaignType == 'send-sms'){
			this.setState({
				campaignTypeSelected: false,
				smsInputStep: true,
				designCampStep: false
			})
		}
		if(campaignType == 'design-campaign'){
			this.setState({
				campaignTypeSelected: false,
				smsInputStep: false,
				designCampStep: true
			})
		}
		e.target.value = '';
	}

	getListData(e){
		const listId = e.target.getAttribute('data-list-id');
		fetch(`${WS_URL}get-list-data.php`, {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: '&userID='+this.state.userID+'&listID='+listId,
	      }).then(response => {
	        return response.json();
	      }).then(json => {
	           
	           if(json < 1) {
	      			console.log('No data');
	      		}else {
	      			
	      			this.setState({
	      				listData: json,
	      				listToshow : true
	      			})

	      			//console.log(JSON.stringify('Ji'+this.state.listData));

	      		}

	      });
	}

	closeListToShow(){
		this.setState({
			listToshow : false
		})
	}


	handleChange({ target }) {
		this.setState({
		  [target.name]: target.value
		});
	}


	_handleImageChange(e) {
	    e.preventDefault();

	    let reader = new FileReader();
	    let file = e.target.files[0];

	    reader.onloadend = () => {
	      this.setState({
	        file: file,
	        imagePreviewUrl: reader.result,
	        nextStep: true,
	        cancelImg: true,
	      });
	      //console.log(this.state.imagePreviewUrl);
	    }
	    reader.readAsDataURL(file);
	  }

	  nextStepToContacts(){
	  	if(this.state.campaignName!=null){
		  	this.setState({
		  		chooseImageStep: false,
		  		chooseContactListStep: true,
		  		campaignNameError: false,
		  	})
	  	}else {
  			this.setState({
  				campaignNameError: true
  			})
	  	}
	  	

	  	//console.log('Camapign Name is '+this.state.campaignName);
	  }

	  nextSMSStepToContacts(){

	  	if(this.state.campaignSender!=null){
		  	this.setState({
		  		smsInputStep: false,
		  		chooseSMSContactListStep: true,
		  		campaignSenderError: false,
		  	})
	  	}else {
  			this.setState({
  				campaignSenderError: true,
  			})
	  	}
	  	

	  	//console.log('Camapign Name is '+this.state.campaignName);
	  }

	  backToChooseImage(){
	  	this.setState({
	  		chooseImageStep: true,
	  		chooseContactListStep: false
	  	})
	  }

	  backToChooseCampaignType(){
	  	this.setState({
	  		campaignTypeSelected: true,
	  		chooseImageStep: false,
	  		chooseContactListStep: false,
				smsInputStep: false,
				designCampStep: false	,
				nextStep: true
	  	})
	  }

	  backToSMSStep1(){
	  	this.setState({
	  		campaignTypeSelected: false,
	  		chooseImageStep: false,
	  		chooseContactListStep: false,
	  		smsInputStep: true,
	  		chooseSMSContactListStep: false

	  	})
	  }



  	componentDidMount(){

  		fetch(`${WS_URL}get-contact-list.php`, {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: 'email='+this.state.sessionUser+'&userID='+this.state.userID,
	      }).then(response => {
	        return response.json();
	      }).then(json => {
	           
	           if(json < 1) {
	      			//console.log('No data');
	      		}else {
	      			
	      			
	      			this.setState({
	      				fulldata: json,
	      				haveContactList: true
	      			})

	      			//console.log(JSON.stringify(this.state.fulldata));

	      		}

	      });
	}

	listChecked(e,key){
		let newItem = this.state.items;
		if(e.target.checked){
			//console.log('checked');
			newItem[e.target.value] = e.target.value	        
	    }else {
	    	delete newItem[e.target.value];
	    	//console.log('unchecked');
	    }

			this.setState({
	            items: newItem
	        });

	}

	sendCampaignNow(){
		this.setState({
			loading: true
		})

		fetch(`${WS_URL}send-campaign-now.php`, {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: 'campaignName='+this.state.campaignName+'&campaignContent='+this.state.campaignContent+'&listIDs='+JSON.stringify(this.state.items)+'&userID='+this.state.userID+'&image='+this.state.imagePreviewUrl,
	      }).then(response => {
	        return response.json();
	      }).then(json => {
	      		if(json > 0){
	      			this.setState({
	      				campaignTypeSelected: true,
	      				nextStep: false,
								chooseImageStep: false,
								chooseContactListStep: false,
								campSendSMSSuccess: false,
								campSendSuccess: true,
								loading: false
	      			})
	      		}
	      })
	}

	sendTestImageCamp(){
		this.setState({
			loading: true
		})
		var emailTesting = this.refs.email_test.value;
		fetch(`${WS_URL}send-test-image-campaign.php`, {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: 'campaignName='+this.state.campaignName+'&campaignContent='+this.state.campaignContent+'&userID='+this.state.userID+'&image='+this.state.imagePreviewUrl+'&email='+emailTesting,
	      }).then(response => {
	        return response.json();
	      }).then(json => {
	      		if(json > 0){
	      			this.setState({
	      				imageCampTestSendSuc: true,
						loading: false
	      			})
	      		}
	      })
	}

	sendTestImageCampModal(){
		this.setState({
			testImageCampModal: true
		});
	}

	closeTestImageCampModal(){
		this.setState({
			testImageCampModal: false,
			imageCampTestSendSuc: false
		})
	}

	sendSMSNow(){
		
		this.setState({
			loading: true
		})
		var smsMessage = this.refs.smsMessage.value;

		fetch(`${WS_URL}send-sms-now.php`, {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: 'campaignSender='+this.state.campaignSender+'&listIDs='+JSON.stringify(this.state.items)+'&userID='+this.state.userID+'&message='+smsMessage,
	      }).then(response => {
                return response.json();
        	}).then(json => {
	      		if(json.status == "success"){
	      			this.setState({
	      				campaignTypeSelected: true,
	      				nextStep: false,
						chooseImageStep: false,
						chooseContactListStep: false,
						campSendSMSSuccess: true,
						campSendSuccess: false,
						chooseSMSContactListStep: false,
						loading: false
	      			})
	      		}
	      })
	}


	sendTestSMS(){
		this.setState({
			loading: true
		})
		var smsMessage = this.refs.smsMessage.value;
		var mobile = this.refs.mobile_no_test.value;
		fetch(`${WS_URL}send-test-sms-now.php`, {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: 'campaignSender='+this.state.campaignSender+'&userID='+this.state.userID+'&mobile='+mobile+'&message='+smsMessage,
	      }).then(response => {
                return response.json();
        	}).then(json => {
	      		if(json.status == "success"){
	      			this.setState({
	      				campaignTypeSelected: true,
	      				nextStep: false,
						chooseImageStep: false,
						chooseContactListStep: false,
						campSendSMSSuccess: true,
						campSendSuccess: false,
						chooseSMSContactListStep: false,
						loading: false
	      			})
	      		}
	      })
	}

	sendTestSMSModal(){
		this.setState({
			testSMSModal: true
		});
	}

	closeTestSMSModal(){
		this.setState({
			testSMSModal: false
		})
	}


	addNewListModalBox(e){

		fetch(`${WS_URL}get-lists.php`, {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: '&userID='+this.state.userID,
	      }).then(response => {
	        return response.json();
	      }).then(json => {
	           
	           if(json < 1) {
	      			console.log('No data');
	      		}else {
	      			
	      			console.log(json);
	      			this.setState({
	      				displayedListsName: json
	      			})

	      			//console.log(JSON.stringify('Ji'+this.state.listData));

	      		}

	      });

		this.setState({
			addNewModal: true,
			addNewListModalForm: true,
			addNewContactModalForm: false,
		})
	}

	closeAddNewModal(){
		this.setState({
			addNewModal: false
		})
	}


	addNewFormType(e){
		const inputRadioVal = (e.target.value);
		if(inputRadioVal == 1){
			this.setState({
				addNewListModalForm: true,
				addNewContactModalForm: false
			})
		}else {
			this.setState({
				addNewListModalForm: false,
				addNewContactModalForm: true
			})
		}
	}

	handleForce(emailCSVData){
		this.setState({
			emailCSV: emailCSVData
		})
	}

	importEmailContacts(){

		this.setState({
			loading: true
		})

		var listId = this.state.listId;
		var contactCSV = this.state.contactCSV;

		fetch(`${WS_URL}add-new-contacts.php`, {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: 'userID='+this.state.userID+'&listID='+listId+'&contact_csv='+JSON.stringify(this.state.emailCSV),
	      }).then(response => {
	        return response.json();
	      }).then(json => {
	           
	           if(json < 1) {
	      			console.log('No data');
	      		}else {
	      			
	      			this.setState({
	      				importCSV: true,
	      				loading: false
	      			})
	      			
	      		}

	      });
	}


	showSidePreviewContent(){
		this.setState({
			emailListToshow: !this.state.emailListToshow
		})
	}

	

	addList(e){
		var newListName = this.refs.new_list_name.value;

		fetch(`${WS_URL}add-new-list.php`, {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: 'userID='+this.state.userID+'&list_name='+newListName,
	      }).then(response => {
	        return response.json();
	      }).then(json => {
	           
	           if(json < 1) {
	      			console.log('No data');
	      		}else {
	      			this.setState({
	      				addNewModal: false
	      			})
	      			this.componentDidMount();
	      		}

	      });
	}

	render(props) {

		const self = this; 

		const listNames = [];
		const contactListsWithView = [];
		const selectedLists = this.state.fulldata;

		const listAll = [];
		const displayedLists = this.state.listData;

		displayedLists.forEach(function(myList, i){
	      	listAll.push(
      			<tr key={i}><td>{i+1}</td><td>{myList.name}</td><td>{myList.email}</td><td>{myList.mobile}</td></tr>
      		)
	  	})

		selectedLists.forEach(function(selectedList, i){
	      contactListsWithView.push(
	        <li key={i} value={selectedList.id}>
          		<label>
		          	<div className="text-ellipsis dis-inline-block width-150">
		          		<input type="checkbox" name="list-selection" value={selectedList.id} onChange={self.listChecked} />
		          		<span>{selectedList.list_name}</span>
		          	</div>
		          	<a href="javascript:void(0)" className="pull-right fa fa-eye" data-list-id={selectedList.id} onClick={self.getListData}></a>
	          	</label>
	        </li>
	      )
	    });


	    const listNameAll = [];
		const displayedListsName = this.state.displayedListsName;

     	displayedListsName.forEach(function(myList, i){
	      	listNameAll.push(
      			<option value={myList.id} key={i}>{myList.list_name}</option>
      		)
	  	}) 

	  	let csvPreview = this.state;
	    let {imagePreviewUrl} = this.state;
			let prevProfileImg  = `${WS_URL}${this.state.prevProfileImg}`;
	    let $imagePreview = null;
	    if (imagePreviewUrl) {
	      $imagePreview = (<img src={imagePreviewUrl} />);
	    } else {
	      $imagePreview = (<img src={prevProfileImg} />);
	    }


	    return (
	    	<div className="container m-t-50">
		    	<div className={this.state.campaignTypeSelected ? "panel panel-default" : "hide"}>
		    		<div className="panel-body">
		    			<h3>Create Campaign - Step 1</h3>
			    		<div className="form-box">
			    			<div className="form-group">
			    				<label className="text-left">Campaign type</label>
			    				<select className="form-control" onChange={this.campaignType}>
			    					<option selected value="">Select campaign type</option>
			    					<option value="send-sms">SMS Campaign</option>
			    					<option value="send-image">Image campaign</option>
			    					<option value="design-campaign">Design campaign</option>
			    				</select>
			    			</div>
			    			<p style={{'font-size':'13px', 'line-height':'21px'}}>*Here, you can create and send Image and SMS campaign. We have also a designing tool which help you to design your campaign with images and content. </p>
			    		</div>
			    		<div className={this.state.campSendSuccess ? "alert alert-info" : "hide"}>
			    			<span className="alert-message">Image campaing has been sent successfully!</span>
		    			</div>
		    			<div className={this.state.campSendSMSSuccess ? "alert alert-info" : "hide"}>
			    			<span className="alert-message">SMS campaing has been sent successfully!</span>
		    			</div>
	    			</div>
	    		</div>
	    		
	    		


	    		{/* Start Image Campaign here */}

	    		<div className={this.state.chooseImageStep ? "panel panel-default" : "hide"}>
		    		<div className="panel-body">
		    			<h3>Image Campaign - Step 1</h3>
		    			<div className="form-group">
		    				<label className="text-left">Campaign name <span className="fa fa-arrow-left pull-right" onClick={this.backToChooseCampaignType}></span></label>
		    				<input type="text" className="form-control" value="Test Campaign" name="campaignName" value={this.state.campaignName} onChange={ this.handleChange } />
		    				<span className={!this.state.campaignNameError ? "hide" : "help-text help-text-error"}>Please enter campaign name</span>
		    			</div>
		    			<div className="form-group">
		    				<label className="text-left">Campaign content</label>
				    		<input type="text" className="form-control" value={this.state.campaignContent} name="campaignContent" ref="campaignContent" onChange={ this.handleChange } />
						</div>
		    			<div className="form-group">
		    				<label className="text-left">Choose Image</label>
				    		<div className="previewComponent">
				        		<div className="banner-img">{$imagePreview}</div>
								<input className="fileInput form-control" type="file" onChange={(e)=>this._handleImageChange(e)} />
							</div>
							<a href="javascript:void(0)" className={this.state.nextStep ? "btn-success btn btn-block m-t-rg" : "hide"} onClick={this.nextStepToContacts}>Next</a>
						</div>
					</div>
				</div>						
				<div className={this.state.chooseContactListStep ? "panel panel-default" : "hide"}>
					<div className="panel-body">
						<h3>Image Campaign - Step 2</h3>
						<div className="form-group">
							<label>Contact lists <span className="fa fa-arrow-left pull-right" onClick={this.backToChooseImage}></span></label>
							<div className="list-table">
								<ul id="contactList">
			    					{contactListsWithView}
			    				</ul>
		    				</div>
	    				</div>
				  		<div className="form-group m-t-rg">
    						<button type="button" onClick={this.sendCampaignNow} className="btn btn-success btn-block" disabled={!this.state.haveContactList}><span className={this.state.loading ? "fa fa-spin fa-spinner" : "hide"}></span> Send now</button>
    						<button type="button" onClick={this.sendTestImageCampModal} className="btn btn-login m-t-sm btn-block"><span className={this.state.loading ? "fa fa-spin fa-spinner" : "hide"}></span> Send a test mail</button>
    						<p className={!this.state.haveContactList ? "text-error" : "hide"}>You have atleast one(1) contact list(s) to send campaigns.</p>
	    					</div>
	    					<div className="text-center group-anchor" style={{'margin-top':'10px'}}>
	    					<a href="javascript:void(0)" onClick={this.addNewListModalBox}>Add list/contacts</a>
    					</div>

    					<div className={this.state.listToshow ? "side-preview-content side-preview-content-open width-100" : "side-preview-content side-preview-content-hide"}>
	    					<span className="fa fa-stack fa-arrow-right text-right hide-preview" onClick={this.closeListToShow}></span>
				      		<div className="content-container">
				      			<table className="table width-100 text-xs">{listAll}</table>
			      			</div>
				  		</div>	
    				</div>
				</div>

	    		{/* Ends Image Campaign here */}


	    		{/* Start SMS Campaign here */}

	    		<div className={this.state.smsInputStep ? "panel panel-default" : "hide"}>
		    		<div className="panel-body">
		    			<h3>SMS Campaign - Step 1</h3>
		    			<div className="form-group">
		    				<label className="text-left">Sender <span className="fa fa-arrow-left pull-right" onClick={this.backToChooseCampaignType}></span></label>
		    				<input type="text" className="form-control" value={this.state.campaignSender} name="campaignSender" ref="campaignSender" onChange={ this.handleChange } />
		    				<span className={!this.state.campaignSenderError ? "hide" : "help-text help-text-error"}>Please enter campaign sender</span>
		    			</div>
		    			<div className="form-group">
		    				<label className="text-left">Type your message here</label>
		    				<textarea ref="smsMessage" className="form-control"></textarea>
							<a href="javascript:void(0)" className="btn-success btn btn-block m-t-rg" onClick={this.nextSMSStepToContacts}>Next</a>
						</div>
					</div>
				</div>

				<div className={this.state.chooseSMSContactListStep ? "panel panel-default" : "hide"}>
					<div className="panel-body">
						<h3>SMS Campaign - Step 2</h3>
						<div className="form-group">
							<label>Contact lists <span className="fa fa-arrow-left pull-right" onClick={this.backToSMSStep1}></span></label>
							<div className="list-table">
								<ul id="contactList">
			    					{contactListsWithView}
			    				</ul>
		    				</div>
	    				</div>
				  		<div className="form-group m-t-rg">
    						<button type="button" onClick={this.sendSMSNow} className="btn btn-success btn-block" disabled={!this.state.haveContactList}><span className={this.state.loading ? "fa fa-spin fa-spinner" : "hide"}></span> Send now</button>
    						<button type="button" onClick={this.sendTestSMSModal} className="btn btn-login m-t-sm btn-block"><span className={this.state.loading ? "fa fa-spin fa-spinner" : "hide"}></span> Send a test</button>
    						<p className={!this.state.haveContactList ? "text-error" : "hide"}>You have atleast one(1) contact list(s) to send campaigns.</p>
	    					</div>
	    					<div className="text-center group-anchor" style={{'margin-top':'10px'}}>
	    					<a href="javascript:void(0)" onClick={this.addNewListModalBox}>Add list/contacts</a>
    					</div>

    					<div className={this.state.listToshow ? "side-preview-content side-preview-content-open width-100" : "side-preview-content side-preview-content-hide"}>
	    					<span className="fa fa-stack fa-arrow-right text-right hide-preview" onClick={this.closeListToShow}></span>
				      		<div className="content-container">
				      			<table className="table width-100 text-xs">{listAll}</table>
			      			</div>
				  		</div>
			  		</div>
		  		</div>

	    		{/* End SMS Campaign here */}

	    		{/* Start Design Campaign here */}

	    		<div className={this.state.designCampStep ? "panel panel-default" : "hide"}>
		    		<div className="panel-body">
		    			<h3>Design Campaign - Step 1</h3>
		    			<div className="form-group">
		    				<label className="text-left">Campaign name <span className="fa fa-arrow-left pull-right" onClick={this.backToChooseCampaignType}></span></label>
		    				<input type="text" className="form-control" value="Test Campaign" name="campaignName" value={this.state.campaignName} onChange={ this.handleChange } />
		    				<span className={!this.state.campaignNameError ? "hide" : "help-text help-text-error"}>Please enter campaign name</span>
		    			</div>
		    			<div className="form-group">
							{/* <a href="javascript:void(0)" className="btn-success btn btn-block m-t-rg" onClick={() => { window.location = 'file:///android_asset/www/design-campaign.html'; localStorage.setItem('designCampName',this.state.campaignName); this.setState({loading: true}) }}><span className={this.state.loading ? "fa fa-spin fa-spinner" : "hide"}></span> Next</a> */}
							<a href="javascript:void(0)" className="btn-success btn btn-block m-t-rg" onClick={() => { window.location = '/design-campaign.html'; localStorage.setItem('designCampName',this.state.campaignName); this.setState({loading: true}) }}><span className={this.state.loading ? "fa fa-spin fa-spinner" : "hide"}></span> Next</a>
						</div>
					</div>
				</div>						

	    		{/* Ends Design Campaign here */}

	    		{/* Send a test Image camp / modal box */}

	    		<ModalBox modalBoxClasses={this.state.testImageCampModal ? "show modal" : "hide"}>
	    			<div className="modal-dialog">
	    				<div className="modal-header">
			    			<button className="close-modal" onClick={this.closeTestImageCampModal}></button>
			    			<h3 className="modal-title">Send a image campaign</h3>
			    			<span className={this.state.imageCampTestSendSuc ? "show alert alert-success m-t-rg" : "hide"}>Test email has been sent successfully.</span>
			    		</div>
			    		<div className="form-group">
    						<label className="text-left">Email</label>
    						<input type="text" ref="email_test" className="form-control" onChange={this.handleChange} />
    					</div>
    					<div className="form-group">
    						<button type="button" onClick={this.sendTestImageCamp} className="btn btn-login m-t-sm btn-block"><span className={this.state.loading ? "fa fa-spin fa-spinner" : "hide"}></span> Send</button>
						</div>
		    		</div>
	    		</ModalBox>

	    		{/* Ends - Send a test Image camp / modal box */}

	    		{/* Send a test sms / modal box */}

	    		<ModalBox modalBoxClasses={this.state.testSMSModal ? "show modal" : "hide"}>
	    			<div className="modal-dialog">
	    				<div className="modal-header">
			    			<button className="close-modal" onClick={this.closeTestSMSModal}></button>
			    			<h3 className="modal-title">Send a test</h3>
			    		</div>
			    		<div className="form-group">
    						<label className="text-left">Mobile no.</label>
    						<input type="text" ref="mobile_no_test" className="form-control" onChange={this.handleChange} />
    					</div>
    					<div className="form-group">
    						<button type="button" onClick={this.sendTestSMS} className="btn btn-login m-t-sm btn-block"><span className={this.state.loading ? "fa fa-spin fa-spinner" : "hide"}></span> Send</button>
						</div>
		    		</div>
	    		</ModalBox>

	    		{/* Ends - Send a test sms / modal box */}

	    		{/* Add New List/Contacts here */}

	    		<ModalBox modalBoxClasses={this.state.addNewModal ? "show modal" : "hide"}>
	    			<div className="modal-dialog">
	    				<div className="modal-header">
			    			<button className="close-modal" onClick={this.closeAddNewModal}></button>
			    			<h3 className="modal-title">Add new list here</h3>
			    		</div>
			  			<div className={this.state.importCSV ? "alert alert-success" : "hide"}>
			  				<div className="alert-message">Contacts has been imported successfully!</div>
			  			</div>
			  			<div className="form-group">
			  				<label><input type="radio" ref="addNewFormType" value="1" checked={this.state.addNewListModalForm} onClick={this.addNewFormType}/> Add new list</label>
			  				<label><input type="radio" ref="addNewFormType" value="0" checked={this.state.addNewContactModalForm} onClick={this.addNewFormType}/> Add new contact</label>
			  			</div>
						<div className={this.state.addNewListModalForm ? "show addListForm" : "hide"}>
							<div className="form-group">
	    						<label className="text-left">List name</label>
	    						<input type="text" ref="new_list_name" className="form-control" onChange={this.handleChange} />
	    					</div>
	    					<div className="form-group">
	    						<button className="btn btn-success btn-sm m-t-xs" onClick={this.addList}>Add list</button>
	    					</div>
						</div>
						<div className={this.state.addNewContactModalForm ? "show addContactsForm" : "hide"}>
							<div className="form-group">
	    						<label className="text-left">List name</label>
	    						<select name="listId" onChange={this.handleChange}>
	    							<option>Choose list</option>
	    							{listNameAll}
	    						</select>
	    					</div>
	    					<div className="form-group">
	    						<label className="text-left">Import CSV</label>
	    						<CSVReader label="" onFileLoaded={this.handleForce}/>
	    					</div>
	    					<div className="form-group">
	    						<button onClick={this.importEmailContacts} className="btn btn-success btn-sm m-t-sm"><span className={this.state.loading ? "fa fa-spin fa-spinner" : "hide"}></span> Add contacts</button>
	    					</div>
						</div>
					</div>
				</ModalBox>

				{/* Ends - Add New List/Contacts here */}

	    	</div>
    	)
	}

}

export default CreateCampaign;