import React, { Component } from 'react';
import { Router, Switch, Route, Link,  Redirect,  withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import history from './history';



import SideMenu from './sidemenu';
import Login from './Login';
import About from './about';
import Profile from './profile';
import EditProfile from './edit-profile';
import CreateCampaign from './create-campaign';
import ResendCampaign from './resend-campaign';
import MyCampaigns from './my-campaigns';
import ModalBox from './modal-box';

class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
         sessionUser:'',
         sideMenuOpen: false,
         loading: false,
         invalidLogin: false,
         forgotPassSuc: false,
         returnMsgClass: '',
         showLoginRegAlertMsg: false

      }
      this.loginNow = this.loginNow.bind(this);
      this.registerNow = this.registerNow.bind(this);
      this.menuOpener = this.menuOpener.bind(this);
      this.menuCloser = this.menuCloser.bind(this);
      this.forgotPassword = this.forgotPassword.bind(this);


      if(localStorage.getItem('designCamp') == 'active'){
        // alert('Redirect on resend campaign page, and We get Camp Id '+localStorage.getItem('designCampId') + 'and Camp Type '+localStorage.getItem('designCampType'));
        history.push('/resend-campaign/'+localStorage.getItem('designCampId')+'/'+localStorage.getItem('designCampType'));
      }

      if(localStorage.getItem('sessionUser') == '' || localStorage.getItem('sessionUser') == null || localStorage.getItem('sessionUser') == 'undefined'){
        history.push('/');
      }

      if(localStorage.getItem('designCamp') == 'quit'){
        // alert('Redirect on resend campaign page, and We get Camp Id '+localStorage.getItem('designCampId') + 'and Camp Type '+localStorage.getItem('designCampType'));
        history.push('/my-campaigns/');
      }

   }


   loginNow(e) {

    this.setState({
      loading: true
    })

    localStorage.removeItem('sessionUser');
    localStorage.removeItem('userId');
    //console.log('Username:'+document.getElementById('userEmail').value+', Password:'+document.getElementById('userPass').value);
    fetch('http://ideaweaver.in/campaign-php-ws/login.php', {
    //fetch('http://localhost/campaign-php/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'email='+document.getElementById('userEmail').value+'&password='+document.getElementById('userPass').value,
      }).then(response => {
        return response.json();
      }).then(json => {
          if(json[0].error){
            this.setState({
                'sessionUser':'',
                loading: false,
                invalidLoginMsg: json[0].error,
                invalidLogin: true,
                invalidForPassMsg:'',
                invalidRegMsg: '',
                returnMsgClass: 'alert alert-error',
                showLoginRegAlertMsg: true
            })
          }else{
            localStorage.setItem('sessionUser',json[0].email);
            localStorage.setItem('userId',json[0].user_id);
             this.setState({
                'sessionUser':json[0].email,
                loading: false,
                invalidLogin: false,
                invalidLoginMsg: '',
                invalidForPassMsg:'',
                invalidRegMsg: '',
                returnMsgClass: '',
                invalidLoginMsg: '',
                showLoginRegAlertMsg: true
            });
            localStorage.setItem('designCamp','');
            localStorage.setItem('designCampName','');
            history.push('/profile');
          }  
      });

   }

   registerNow(e) {

    this.setState({
      loading: true
    })


    localStorage.removeItem('sessionUser');
    localStorage.removeItem('userId');

    //console.log('Username:'+document.getElementById('userEmail').value+', Password:'+document.getElementById('userPass').value);
    //fetch('http://localhost/campaign-php/register.php', {
    fetch('http://ideaweaver.in/campaign-php-ws/register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'name='+document.getElementById('userNameReg').value+'&email='+document.getElementById('userEmailReg').value+'&password='+document.getElementById('userPassReg').value,
      }).then(response => {
        return response.json();
      }).then(json => {
          if(json[0].error == 'failure'){
            this.setState({
                loading: false,
                invalidRegMsg: 'Something went wrong, please try again.',
                invalidReg: true,
                invalidLoginMsg: '',
                invalidForPassMsg:'',
                returnMsgClass: 'alert alert-error',
                showLoginRegAlertMsg: true
            })
            localStorage.removeItem('sessionUser');
            localStorage.removeItem('userId');
          }else{
            this.setState({
              loading: false,
              invalidReg: false,
              returnMsgClass: 'alert alert-success',
              invalidRegMsg: '',
              invalidLoginMsg: '',
              invalidForPassMsg:'',
              showLoginRegAlertMsg: true
            })
            localStorage.setItem('sessionUser',json[0].email);
            localStorage.setItem('userId',json[0].user_id);
            history.push('/profile');
          }  
      });
      
   }


   forgotPassword(e){

    this.setState({
      loading: true
    })

    //fetch('http://localhost/campaign-php/forgot-password.php', {
    fetch('http://ideaweaver.in/campaign-php-ws/forgot-password.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'email='+document.getElementById('userEmailForPass').value+'&mobile='+document.getElementById('userMobForPass').value,
      }).then(response => {
        return response.json();
      }).then(json => {
          if(json.status == 'failure'){
            console.log(json.msg);
            this.setState({
                loading: false,
                invalidForPassMsg: json.msg,
                invalidForPass: true,
                invalidLoginMsg: '',
                invalidRegMsg: '',
                returnMsgClass: 'alert alert-error',
                showLoginRegAlertMsg: true
            })
          }else{
             this.setState({
                loading: false,
                invalidForPass: true,
                returnMsgClass: 'alert alert-success',
                invalidForPassMsg: json.msg,
                invalidRegMsg:'',
                invalidLoginMsg: '',
                showLoginRegAlertMsg: true
            });                
          }  
      });
   }


  menuOpener(){
    this.setState({
        sideMenuOpen: !this.state.sideMenuOpen,
        showLoginRegAlertMsg: false
    })
  }

  menuCloser(){
      this.setState({
          sideMenuOpen: false
      })
  }



  render() {

    return (
      <div className="app">
        <div style={{'width':'calc(100% - 8px)','height':'80%','position':'absolute','top':'50px','opacity':'0.05','zIndex':'-1','overflow':'hidden'}}><img src="./email-marketing.png"/></div>
        <Router history={history}>
          <div>
            <SideMenu loggedInOut={this.state.sessionUser} menuOpener={this.menuOpener} sideMenuOpen={this.state.sideMenuOpen} />
            <div className="content-section" onClick={this.menuCloser}>
              <div className={this.state.showLoginRegAlertMsg ? this.state.returnMsgClass : "hide"} style={{'position':'relative','top':'15px','width':'calc(100% - 82px)','margin':'auto'}}>
                {this.state.invalidLoginMsg}
                {this.state.invalidRegMsg}
                {this.state.invalidForPassMsg}
              </div>
              <Route path="/" exact render={(routeProps) => (<Login loginNow={this.loginNow} loadingIcon={this.state.loading} registerNow={this.registerNow} forgotPassword={this.forgotPassword} />)}/>
              <Route path="/about" render={(routeProps) => (<About showHideAlertMsg={this.state.showLoginRegAlertMsg} />)}/>
              <Route path="/profile" render={(routeProps) => (<Profile sessionUser={this.state.sessionUser} />)}/>
              <Route path="/create-campaign/" render={(routeProps) => (<CreateCampaign sessionUser={this.state.sessionUser} {...routeProps} />)}/>
              <Route path="/resend-campaign/:campId/:campType" render={(routeProps) => (<ResendCampaign sessionUser={this.state.sessionUser} {...routeProps} />)}/>
              <Route path="/edit-profile/:userId" render={(routeProps) => (<EditProfile sessionUser={this.state.sessionUser} {...routeProps} />)}/>
              <Route path="/my-campaigns" render={(routeProps) => (<MyCampaigns sessionUser={this.state.sessionUser}  {...routeProps} />)}/>
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
