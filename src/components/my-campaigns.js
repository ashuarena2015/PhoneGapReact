import React, { Component } from 'react';
import { Redirect, Link} from "react-router-dom";
import ModalBox from './modal-box';
import history from './history';

class MyCampaigns extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userID: localStorage.getItem('userId'),
			fulldata: [],
			campId:'',
			loading: true,
			campDeleteMsgShow: false,
			showPreviewModal: false
		}

		if(localStorage.getItem('sessionUser') == '' || localStorage.getItem('sessionUser') == null){
			history.push('/');
		}

		this.goToCampaigns = this.goToCampaigns.bind(this);
		this.deleteCamp = this.deleteCamp.bind(this);
		this.previewCamp = this.previewCamp.bind(this);
		this.closePreviewModal = this.closePreviewModal.bind(this);

		console.log(this.props);
		console.log('Campaign type='+this.props.match.params.campType);
	}

	componentDidMount(){
		fetch('http://ideaweaver.in/campaign-php-ws/get-my-campaigns.php', {
		//fetch('http://localhost/campaign-php/get-my-campaigns.php', {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: 'userID='+this.state.userID,
	      }).then(response => {
	        return response.json();
	      }).then(json => {
	           
	           if(json < 1) {
	      			//console.log('No data');
	      		}else {
      				this.setState({
      					fulldata: json,
      					loading: false
      				})
	      		}

	      });
	}

	goToCampaigns(){
		var getCampType = this.refs.campTypeSelect.value;
		history.push('/my-campaigns/#'+getCampType);
	}

	deleteCamp(id){
		console.log(id);
		// fetch('http://localhost/campaign-php/delete-campaign.php', {
		fetch('http://ideaweaver.in/campaign-php-ws/delete-campaign.php', {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      },
	      body: 'camp_id='+id,
	      }).then(response => {
	        return response.json();
	      }).then(json => {
	           if(json.status > 0) {
	           		this.setState({
	           			campDeleteMsgShow: true,
	           			campDeleteMsg: 'Campaign has been deleted successfully!',
	           			campDeleteClass: 'alert alert-success'
	           		})
	           		setTimeout(() => {
	           			this.setState({campDeleteMsgShow: false});
					}, 2000)
	           		this.componentDidMount();
	           }else {
	           		this.setState({
	           			campDeleteMsgShow: true,
	           			campDeleteMsg: 'Campaign could not deleted, please try again.',
	           			campDeleteClass: 'alert alert-error'
	           		})
	           }
	      });
	}

	previewCamp(id){
		console.log(id);
		this.setState({
			showPreviewModal: true,
			iframeSRC: id
		})
	}

	closePreviewModal(){
		this.setState({
			showPreviewModal: false
		})
	}

	render(props) {

		const self = this;
		const campaigns = [];
		const campaignLists = this.state.fulldata;

		campaignLists.forEach(function(myCampaignList, i){
			const campType = window.location.href.split('#')[1];
			if(campType){
				if(myCampaignList.campaign_type == campType && myCampaignList.campaign_type != 'undefined'){
			      	campaigns.push(
		      			<li key={i}>
		      				<div className={myCampaignList.campaign_type == 2 ? "text-ellipsis dis-inline-block width-100px" : "text-ellipsis dis-inline-block width-150"}>{myCampaignList.campaign_name} <div><span>#{myCampaignList.id}</span>, <span>{myCampaignList.campaign_type == 0 ? "Image" : ''} {myCampaignList.campaign_type == 1 ? "SMS" : ''} {myCampaignList.campaign_type == 2 ? "Design" : ''}</span><br/><span>{myCampaignList.campaign_date}</span></div></div>
		      				<div className="pull-right action-btn m-t-sm">
		      					<Link to={`/resend-campaign/${myCampaignList.id}/${myCampaignList.campaign_type}`} className="active btn" style={{'textDecoration':'underline','color':'cornflowerblue'}}><span className="fa fa-repeat text-success"></span></Link>
		      					<Link to="#" onClick={()=> { if (window.confirm('Are you sure you wish to delete this item?')) self.deleteCamp(myCampaignList.id)}} className="active btn" style={{'textDecoration':'underline','color':'cornflowerblue'}}><span className="fa fa-times text-error"></span></Link>
		      					<Link to="#" onClick={()=> self.previewCamp(myCampaignList.id)} className={myCampaignList.campaign_type == 2 ? "active btn" : "hide"} style={{'textDecoration':'underline','color':'cornflowerblue'}}><span className="fa fa-eye text-info"></span></Link>
	      					</div>
		  				</li>
		      		)
		      	}
	      	}else{
	      		campaigns.push(
	      			<li key={i}>
	      				<div className={myCampaignList.campaign_type == 2 ? "text-ellipsis dis-inline-block width-100px" : "text-ellipsis dis-inline-block width-150"}>{myCampaignList.campaign_name} <div><span>#{myCampaignList.id}</span>, <span>{myCampaignList.campaign_type == 0 ? "Image" : ''} {myCampaignList.campaign_type == 1 ? "SMS" : ''} {myCampaignList.campaign_type == 2 ? "Design" : ''}</span><br/><span>{myCampaignList.campaign_date}</span></div></div>
	      				<div className="pull-right action-btn m-t-sm">
	      					<Link to={`/resend-campaign/${myCampaignList.id}/${myCampaignList.campaign_type}`} className="active btn" style={{'textDecoration':'underline','color':'cornflowerblue'}}><span className="fa fa-repeat text-success"></span></Link>
	      					<Link to="#" onClick={()=> { if (window.confirm('Are you sure you wish to delete this item?')) self.deleteCamp(myCampaignList.id)}} className="active btn" style={{'textDecoration':'underline','color':'cornflowerblue'}}><span className="fa fa-times text-error"></span></Link>
	      					<Link to="#" onClick={()=> self.previewCamp(myCampaignList.id)} className={myCampaignList.campaign_type == 2 ? "active btn" : "hide"} style={{'textDecoration':'underline','color':'cornflowerblue'}}><span className="fa fa-eye text-info"></span></Link>
      					</div>
	  				</li>
	      		)
	      	}
	  	})

	    return (
	    	<div className="container m-t-50">
		    	<div className="panel panel-default">
		    		<div className="panel-body">
		    			<div className={this.state.campDeleteMsgShow ? this.state.campDeleteClass : "hide"}>
			    			<span className="alert-message">{this.state.campDeleteMsg}</span>
		    			</div>
		    			<h3>My Campaigns</h3>
		    			<ul className="unstyle text-xs">
		    				<li>
		    					<div className="dis-inline-block width-150 m-t-xs">Campaign</div>
		    					<div className="pull-right text-right">
		    						<select ref="campTypeSelect" onChange={this.goToCampaigns} className="form-control pull-right width-100px" style={{'padding':'5px'}}>
		    							<option value="">All</option>
		    							<option value="0">Image</option>
		    							<option value="1">SMS</option>
		    							<option value="2">Design</option>
		    						</select>
	    						</div>
	    						<div className="clearfix"></div>
	    					</li>
    					</ul>
    					<ul className="unstyle text-xs overflow-auto" style={{'maxHeight':'300px'}}>
		    				<div className={this.state.loading ? 'text-center' : 'hide'}>
		    					<span className="fa fa-spin fa-spinner fa-3x m-t-rg"></span>
	    					</div>
	    					{campaigns}
	    				</ul>
	    			</div>
    			</div>
    			{/* Display design campaign preview here */}

	    		<ModalBox modalBoxClasses={this.state.showPreviewModal ? "show modal" : "hide"}>
	    			<div className="modal-dialog">
	    				<div className="modal-header">
			    			<button className="close-modal" onClick={this.closePreviewModal}></button>
			    		</div>
			  			<iframe className="preview-iframeBox" src={'http://ideaweaver.in/campaign-php-ws/user-design-campaigns/' + this.state.iframeSRC + '-designCamp.html'}></iframe>
					</div>
				</ModalBox>

				{/* Display design campaign preview here */}

			</div>
    	)
	}

}

export default MyCampaigns;