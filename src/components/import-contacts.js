 import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import CSVReader from "react-csv-reader";
import history from './history';

class ImportContacts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sessionUser: localStorage.getItem('sessionUser'),
			userID: localStorage.getItem('userId'),
			fulldata: [],
			createNewList: false,
			listData: [],
			displayAllListContact:false,
			listToshow: false,
			items: {},
			displayedListsName:[],
			listId:'',
			contactCSV:'',
			emailCSV:[],
			emailListToshow: false,
			importCSV: false,
			loading: false,
			haveContactList: false
		}

		this.getListData = this.getListData.bind(this);
		this.closeListToShow = this.closeListToShow.bind(this);
		this.listChecked = this.listChecked.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.addNewListModalBox = this.addNewListModalBox.bind(this);
		this.addNewFormType = this.addNewFormType.bind(this);
		this.importEmailContacts = this.importEmailContacts.bind(this);
		this.handleForce = this.handleForce.bind(this);
		this.showSidePreviewContent = this.showSidePreviewContent.bind(this);
		this.addList = this.addList.bind(this);

		if(localStorage.getItem('sessionUser') == '' || localStorage.getItem('sessionUser') == null){
			history.push('/');
		}

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
	      		}
	      });
	}

	listChecked(e){
		let newItem = this.state.items;
		if(e.target.checked){
			newItem[e.target.value] = e.target.value	        
	    }else {
	    	delete newItem[e.target.value];
	    }
			this.setState({
				items: newItem
			});
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
	      			this.setState({
	      				displayedListsName: json
	      			})
	      		}

	      });

		this.setState({
			addNewModal: true,
			addNewListModalForm: true,
			addNewContactModalForm: false,
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
		});
		var listId = this.state.listId;
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
	      			this.componentDidMount();
	      		}
	      });
	}

	render() {

		const self = this; 
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
		const displayedListsName = this.state.fulldata;

     	displayedListsName.forEach(function(myList, i){
	      	listNameAll.push(
      			<option value={myList.id} key={i}>{myList.list_name}</option>
      		)
	  	}) 


	    return (
	    	<div className="container m-t-50">
		    	<div className="panel panel-default">
		    		<div className="panel-body">
		    			<h3>Import Contacts</h3>
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
						</div>
	    	</div>
    	)
	}

}

export default ImportContacts;