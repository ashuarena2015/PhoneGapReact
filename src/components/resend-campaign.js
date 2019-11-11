import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import ModalBox from './modal-box';
import CSVReader from "react-csv-reader";

class ResendCampaign extends Component {
	constructor(props) {
		super(props);
		this.state = {
			chooseImageStep: true,
			chooseContactListStep: false,
			campaignName: null,
			campaignContent: '',
			sessionUser: localStorage.getItem('sessionUser'),
			userID: localStorage.getItem('userId'),
			fulldata: [],
			campdata: [],
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
			campaignData: '',
			designCampStep: false,
			chooseDesignContactListStep: false,
			designCampPreview: '',
			campaignDesignName: '',
			campaignDesignID:'',
			loading: false,
			haveContactList: false,
			testDesignCampModal: false,
			designCampTestSendSuc: false,
			testSMSModal: false,
			testImageCampModal: false,
			imageCampTestSendSuc: false
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
		this.nextDesignStepToContacts = this.nextDesignStepToContacts.bind(this);
		this.sendDesignCampNow = this.sendDesignCampNow.bind(this);
		this.addList = this.addList.bind(this);
		this.backToDesignCampStep1= this.backToDesignCampStep1.bind(this);
		this.backToSMSStep1 = this.backToSMSStep1.bind(this);
		this.sendTestDesignCamp = this.sendTestDesignCamp.bind(this);
		this.closeTestDesignCampModal = this.closeTestDesignCampModal.bind(this);
		this.sendTestDesignCampModal = this.sendTestDesignCampModal.bind(this);
		this.sendTestSMS = this.sendTestSMS.bind(this);
		this.closeTestSMSModal = this.closeTestSMSModal.bind(this);
		this.sendTestSMSModal = this.sendTestSMSModal.bind(this);
		this.sendTestImageCampModal = this.sendTestImageCampModal.bind(this);
		this.closeTestImageCampModal = this.closeTestImageCampModal.bind(this);
		this.sendTestImageCamp = this.sendTestImageCamp.bind(this);

		console.log(this.props);
		console.log('Active Campaign='+this.props.match.params.campId);
		console.log('Campaign type='+this.props.match.params.campType);

		if(localStorage.getItem('sessionUser') == '' || localStorage.getItem('sessionUser') == null){
			history.push('/');
		}

		if(localStorage.getItem('designCamp') == 'active'){
	        // alert('We are on resend campaign page');
	        this.setState({
	        	designCampStep: true
	        })
      	}

	}

	campaignType(e){
		const campaignType = e.target.value;
		console.log(campaignType);
		if(campaignType == 'send-image'){
			this.setState({
				campaignTypeSelected: false,
				chooseImageStep: true,
			})
		}
		if(campaignType == 'send-sms'){
			this.setState({
				campaignTypeSelected: false,
				smsInputStep: true,
			})
		}
		e.target.value = '';
	}

	getListData(e){
		const listId = e.target.getAttribute('data-list-id');
		console.log(listId);
		fetch('http://ideaweaver.in/campaign-php-ws/get-list-data.php', {
		//fetch('http://localhost/campaign-php/get-list-data.php', {
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
		console.log('ADASD');
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
	  	console.log(this.state.campaignSender);
	  	if(this.state.campaignSender!=null){
		  	this.setState({
		  		smsInputStep: false,
		  		chooseSMSContactListStep: true,
		  		campaignSenderError: false,
		  	})
	  	}else {
  			this.setState({
  				campaignSenderError: true
  			})
	  	}
	  	
	  }

	  nextDesignStepToContacts(){
	  	if(this.state.campaignDesignName!=null){
		  	this.setState({
		  		smsInputStep: false,
		  		chooseSMSContactListStep: false,
		  		campaignSenderError: false,
		  		chooseDesignContactListStep: true,
		  		designCampStep: false

		  	})
	  	}else {
  			this.setState({
  				campaignSenderError: true
  			})
	  	}
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
	  		designCampStep: false,
	  		smsInputStep: false,
	  		chooseSMSContactListStep: false
	  	})
	  }

	  backToDesignCampStep1(){
	  		this.setState({
	  			designCampStep: true,
	  			chooseContactListStepDesign: false,
	  			chooseDesignContactListStep: false,
	  			chooseImageStep: false,
		  		chooseContactListStep: false,
		  		smsInputStep: false,
		  		chooseSMSContactListStep: false
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

  		fetch('http://ideaweaver.in/campaign-php-ws/resend-campaign-data.php', {
		//fetch('http://localhost/campaign-php/resend-campaign-data.php', {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: 'campId='+this.props.match.params.campId,
	      }).then(response => {
	        return response.json();
	      }).then(json => {
	      			
	      			this.setState({
	      				campdata: json
	      			})

	      			console.log('CampaData='+this.state.campdata);
	      			console.log(JSON.stringify(this.state.campdata));


	      			if(this.state.campdata[0].campaign_type == 0) {
	      				console.log(this.state.campdata[0]);
		      			this.setState({
		      				campaignName: this.state.campdata[0].campaign_name,
		      				campaignData: this.state.campdata[0].campaign_data,
		      				chooseImageStep: true,
		      				smsInputStep: false
		      			})
		      		}

		      		if(this.state.campdata[0].campaign_type == 1) {
		      			console.log('SMS type');
		      			this.setState({
		      				campaignSender: this.state.campdata[0].campaign_name,
		      				campaignData: this.state.campdata[0].campaign_data,
		      				chooseImageStep: false,
		      				smsInputStep: true
		      			})
		      		}

		      		if(this.state.campdata[0].campaign_type == 2) {
		      			console.log('Design type');
		      			this.setState({
		      				campaignDesignName: this.state.campdata[0].campaign_name,
		      				campaignData: this.state.campdata[0].campaign_data,
		      				chooseImageStep: false,
		      				designCampStep: true,
		      				designCampPreview: this.state.campdata[0].id,
		      				campaignDesignID: this.state.campdata[0].id
		      			})
		      		}

	      			

      	});

        fetch('http://ideaweaver.in/campaign-php-ws/get-contact-list.php', {
		//fetch('http://localhost/campaign-php/get-contact-list.php', {
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

		if(!this.state.imagePreviewUrl){
			var sendingImg = this.state.campaignData;
		}else {
			var sendingImg = this.state.imagePreviewUrl;
		}

		fetch('http://ideaweaver.in/campaign-php-ws/send-campaign-now.php', {
		//fetch('http://localhost/campaign-php/send-campaign-now.php', {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: 'campaignName='+this.state.campaignName+'&campaignContent='+this.state.campaignContent+'&listIDs='+JSON.stringify(this.state.items)+'&userID='+this.state.userID+'&image='+sendingImg,
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
						chooseDesignContactListStep: false,
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
		fetch('http://ideaweaver.in/campaign-php-ws/send-test-image-campaign.php', {
		//fetch('http://localhost/campaign-php/send-test-image-campaign.php', {
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
		fetch('http://ideaweaver.in/campaign-php-ws/send-sms-now.php', {
		// fetch('http://localhost/campaign-php/send-sms-now.php', {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: 'campaignSender='+this.state.campaignSender+'&listIDs='+JSON.stringify(this.state.items)+'&userID='+this.state.userID+'&message='+smsMessage,
	      }).then(response => {
                return response.json();
        	}).then(json => {
        		console.log(json);
	      		console.log(json['balance']);
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
		fetch('http://ideaweaver.in/campaign-php-ws/send-test-sms-now.php', {
		//fetch('http://localhost/campaign-php/send-test-sms-now.php', {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: 'campaignSender='+this.state.campaignSender+'&userID='+this.state.userID+'&mobile='+mobile+'&message='+smsMessage,
	      }).then(response => {
                return response.json();
        	}).then(json => {
        		console.log(json);
	      		console.log(json['balance']);
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

	sendDesignCampNow(){
		
		this.setState({
			loading: true
		})

		fetch('http://ideaweaver.in/campaign-php-ws/send-design-campaign-now.php', {
		//fetch('http://localhost/campaign-php/send-design-campaign-now.php', {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: 'campaignName='+this.state.campaignDesignName+'&listIDs='+JSON.stringify(this.state.items)+'&userID='+this.state.userID+'&campaignDesignID='+this.state.campaignDesignID,
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
						campSendSuccess: false,
						campSendDesignSuccess: true,
						chooseDesignContactListStep: false,
						loading: false
	      			})
	      		}
	      })
	}

	sendTestDesignCamp(){
		this.setState({
			loading: true
		})
		var emailTesting = this.refs.email_design_test.value;
		fetch('http://ideaweaver.in/campaign-php-ws/send-test-design-campaign.php', {
		//fetch('http://localhost/campaign-php/send-test-design-campaign.php', {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: 'campaignName='+this.state.campaignDesignName+'&userID='+this.state.userID+'&campaignDesignID='+this.state.campaignDesignID+'&email='+emailTesting,
	      }).then(response => {
	        return response.json();
	      }).then(json => {
	      		if(json > 0){
	      			this.setState({
	      				designCampTestSendSuc: true,
						loading: false
	      			})
	      		}
	      })
	}

	sendTestDesignCampModal(){
		this.setState({
			testDesignCampModal: true
		})
	}

	closeTestDesignCampModal(){
		this.setState({
			testDesignCampModal: false
		})
	}

	


	addNewListModalBox(e){
		fetch('http://ideaweaver.in/campaign-php-ws/get-lists.php', {
		//fetch('http://localhost/campaign-php/get-lists.php', {
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
		//console.log(emailCSVData.length);
		//console.log(JSON.stringify(emailCSVData));

		this.setState({
			emailCSV: emailCSVData
		})

		console.log(JSON.stringify(this.state.emailCSV));
	}

	importEmailContacts()
	{
		var listId = this.state.listId;
		var contactCSV = this.state.contactCSV;


		fetch('http://ideaweaver.in/campaign-php-ws/add-new-contacts.php', {
		//fetch('http://localhost/campaign-php/add-new-contacts.php', {
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
	      				importCSV: true
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
		console.log(newListName);
		fetch('http://ideaweaver.in/campaign-php-ws/add-new-list.php', {
		//fetch('http://localhost/campaign-php/add-new-list.php', {
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
	      				addNewModal: false,
	      				designCampStep: false,
	      				chooseDesignContactListStep: true
	      			})

	      			fetch('http://ideaweaver.in/campaign-php-ws/get-contact-list.php', {
      				//fetch('http://localhost/campaign-php/get-contact-list.php', {
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
				      				fulldata: json
				      			})

				      			//console.log(JSON.stringify(this.state.fulldata));

				      		}

				      });
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
		let prevProfileImg  = 'http://ideaweaver.in/campaign-php-ws/'+this.state.campaignData;
		//let prevProfileImg  = 'http://localhost/campaign-php/'+this.state.campaignData;
	    let $imagePreview = null;
	    if (imagePreviewUrl) {
	      $imagePreview = (<img src={imagePreviewUrl} />);
	    } else {
	      $imagePreview = (<img src={prevProfileImg} />);
	    }


	    {/*const emailsAll = [];
		const emailsArray = this.state.emailCSV;

		emailsArray.forEach(function(data, i){
	      	emailsAll.push(data);
	  	})*/}

	    return (
	    	<div className="container m-t-50">

	    		<div className={this.state.campaignTypeSelected ? "panel panel-default" : "hide"}>
		    		<div className="panel-body">
			    		<div className={this.state.campSendSuccess ? "alert alert-info" : "hide"}>
			    			<span className="alert-message">Image campaing has been sent successfully!</span>
		    			</div>
		    			<div className={this.state.campSendSMSSuccess ? "alert alert-info" : "hide"}>
			    			<span className="alert-message">SMS campaing has been sent successfully!</span>
		    			</div>
		    			<div className={this.state.campSendDesignSuccess ? "alert alert-info" : "hide"}>
			    			<span className="alert-message">Design campaing has been sent successfully!</span>
		    			</div>
	    			</div>
	    		</div>

	    		{/* Start Image Campaign here */}

	    		<div className={this.state.chooseImageStep ? "panel panel-default" : "hide"}>
		    		<div className="panel-body">
		    			<h3>Image Campaign - Step 1</h3>
		    			<div className="form-group">
		    				<label className="text-left">Campaign name</label>
		    				<input type="text" className="form-control" value="" name="campaignName" value={this.state.campaignName} onChange={ this.handleChange } />
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
							<a href="javascript:void(0)" className="btn-success btn btn-block m-t-rg" onClick={this.nextStepToContacts}>Next</a>
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
		    				<label className="text-left">Sender</label>
		    				<input type="text" className="form-control" value={this.state.campaignSender} name="campaignSender" ref="campaignSender" onChange={ this.handleChange } />
		    				<span className={!this.state.campaignSenderError ? "hide" : "help-text help-text-error"}>Please enter campaign sender</span>
		    			</div>
		    			<div className="form-group">
		    				<label className="text-left">Type your message here</label>
		    				<textarea ref="smsMessage" name="campaignData" className="form-control" value={this.state.campaignData} onChange={ this.handleChange }></textarea>
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
		    				<label className="text-left">Sender</label>
		    				<input type="text" className="form-control" value={this.state.campaignDesignName} name="campaignDesignName" ref="campaignDesignName" onChange={ this.handleChange } />
		    				<span className={!this.state.campaignSenderError ? "hide" : "help-text help-text-error"}>Please enter campaign sender</span>
		    				<input type="hidden" className="form-control" value={this.state.campaignDesignID} name="campaignDesignID" ref="campaignDesignID" onChange={ this.handleChange } />
		    			</div>
		    			<div className="form-group">
		    				<label className="text-left">Your design</label>
		    				<textarea ref="designCampMessage" name="campaignData" className="form-control hide" value={this.state.campaignData} onChange={ this.handleChange }></textarea>
		    				<iframe style={{'width': 'calc(100% - 2px)', 'background':'#fff','border': '1px solid #e2e2e2'}} src={'http://ideaweaver.in/campaign-php-ws/user-design-campaigns/' + this.state.designCampPreview + '-designCamp.html'}></iframe>
		    				<a href="javascript:void(0)" onClick={() => { window.location = 'file:///android_asset/www/redesign-campaign.html#'+this.state.designCampPreview }} style={{'color':'#000'}}>Redesign?</a>
							<a href="javascript:void(0)" className="btn-success btn btn-block m-t-rg" onClick={this.nextDesignStepToContacts}>Next</a>
						</div>
					</div>
				</div>

				<div className={this.state.chooseDesignContactListStep ? "panel panel-default" : "hide"}>
					<div className="panel-body">
						<h3>Design Campaign - Step 2</h3>
						<div className="form-group">
							<label>Contact lists <span className="fa fa-arrow-left pull-right" onClick={this.backToDesignCampStep1}></span></label>
							<div className="list-table">
								<ul id="contactList">
			    					{contactListsWithView}
			    				</ul>
		    				</div>
	    				</div>
				  		<div className="form-group m-t-rg">
    						<button type="button" onClick={this.sendDesignCampNow} className="btn btn-success btn-block" disabled={!this.state.haveContactList}><span className={this.state.loading ? "fa fa-spin fa-spinner" : "hide"}></span> Send now</button>
    						<button type="button" onClick={this.sendTestDesignCampModal} className="btn btn-login m-t-sm btn-block"><span className={this.state.loading ? "fa fa-spin fa-spinner" : "hide"}></span> Send a test</button>
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

	    		{/* End Design Campaign here */}


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

	    		{/* Send a test Design camp / modal box */}

	    		<ModalBox modalBoxClasses={this.state.testDesignCampModal ? "show modal" : "hide"}>
	    			<div className="modal-dialog">
	    				<div className="modal-header">
			    			<button className="close-modal" onClick={this.closeTestDesignCampModal}></button>
			    			<h3 className="modal-title">Send a design campaign</h3>
			    			<span className={this.state.designCampTestSendSuc ? "show alert alert-success m-t-rg" : "hide"}>Test email has been sent successfully.</span>
			    		</div>
			    		<div className="form-group">
    						<label className="text-left">Email</label>
    						<input type="text" ref="email_design_test" className="form-control" onChange={this.handleChange} />
    					</div>
    					<div className="form-group">
    						<button type="button" onClick={this.sendTestDesignCamp} className="btn btn-login m-t-sm btn-block"><span className={this.state.loading ? "fa fa-spin fa-spinner" : "hide"}></span> Send</button>
						</div>
		    		</div>
	    		</ModalBox>

	    		{/* Ends - Send a test Design camp / modal box */}

	    		{/* Add New List/Contacts here */}

	    		<ModalBox heading="Add new list here" modalBoxClasses={this.state.addNewModal ? "show modal" : "hide"} closeModal={this.closeAddNewModal}>
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

export default ResendCampaign;

