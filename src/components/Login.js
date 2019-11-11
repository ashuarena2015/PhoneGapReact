import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loginForm: true,
            registerForm: false,
            forgotPassForm: false
        }

        this.openRegisterForm = this.openRegisterForm.bind(this);
        this.openLoginForm = this.openLoginForm.bind(this);
        this.openForgotPassForm = this.openForgotPassForm.bind(this);

    }

    openRegisterForm(){
        this.setState({
            loginForm: false,
            registerForm: true,
            forgotPassForm: false
        })
        
    }

    openLoginForm(){
        this.setState({
            loginForm: true,
            registerForm: false,
            forgotPassForm: false
        })
    }

    openForgotPassForm(){
        this.setState({
            loginForm: false,
            registerForm: false,
            forgotPassForm: true
        })
    }

    render(props) {

        return (
            <div className="container vertical-center-box">
                <div className={this.state.loginForm ? "panel" : "hide"}>
                    <div className="panel-body">
                        <h3>Login here</h3>
                        <div className="form-group m-b-rg">
                            <label>Email</label>
                            <input type="text" id="userEmail" className="form-control" />
                        </div>
                        <div className="form-group m-b-rg">
                            <label>Password</label>
                            <input type="password" id="userPass" className="form-control" />
                        </div>
                        <button type="button" onClick={this.props.loginNow} className="btn btn-login btn-block"><span className={this.props.loadingIcon ? "fa fa-spin fa-spinner" : "hide"}></span> Submit</button>
                        <div className="group-anchor m-t-rg text-center">
                            <a href="javascript:void(0)" onClick={this.openRegisterForm}>Signup here</a>
                            <a href="javascript:void(0)" onClick={this.openForgotPassForm}>Forgot password?</a>
                        </div>
                    </div>
                </div>

                {/*New User, Register here*/}

                <div className={this.state.registerForm ? "panel" : "hide"}>
                    <div className="panel-body">
                        <h3>New user, register here</h3>
                        <div className="form-group m-b-rg">
                            <label>Name</label>
                            <input type="text" id="userNameReg" className="form-control" />
                        </div>
                        <div className="form-group m-b-rg">
                            <label>Email</label>
                            <input type="text" id="userEmailReg" className="form-control" />
                        </div>
                        <div className="form-group m-b-rg">
                            <label>Password</label>
                            <input type="password" id="userPassReg" className="form-control" />
                        </div>
                        <button type="button" onClick={this.props.registerNow} className="btn btn-login btn-block"><span className={this.props.loadingIcon ? "fa fa-spin fa-spinner" : "hide"}></span> Submit</button>
                        <div className="group-anchor m-t-rg text-center">
                            <a href="javascript:void(0)" onClick={this.openLoginForm}>Login here</a>
                            <a href="javascript:void(0)" onClick={this.openForgotPassForm}>Forgot password?</a>
                        </div>
                    </div>
                </div>

                {/* Forgot Passowrd */}

                <div className={this.state.forgotPassForm ? "panel" : "hide"}>
                    <div className="panel-body">
                        <h3>Forgot password?</h3>
                        <div className="form-group m-b-rg">
                            <label>Email</label>
                            <input type="text" id="userEmailForPass" className="form-control" />
                        </div>
                        <div className="form-group m-b-rg">
                            <label>Mobile (Registered)</label>
                            <input type="text" id="userMobForPass" className="form-control" />
                        </div>
                        <button type="button" onClick={this.props.forgotPassword} className="btn btn-login btn-block"><span className={this.props.loadingIcon ? "fa fa-spin fa-spinner" : "hide"}></span> Submit</button>
                        <div className="group-anchor m-t-rg text-center">
                            <a href="javascript:void(0)" onClick={this.openLoginForm}>Login here</a>
                            <a href="javascript:void(0)" onClick={this.openForgotPassForm}>Forgot password?</a>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

}

export default Login;