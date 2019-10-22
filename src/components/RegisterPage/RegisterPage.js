import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Input} from "semantic-ui-react";
import { withRouter } from 'react-router-dom'

class RegisterPage extends Component {
  state = {
    name: '',
    email: '',
    password: '',
  };

  registerUser = (event) => {
    event.preventDefault();

    if (this.state.name && this.state.password && this.state.email) {
      this.props.dispatch({
        type: 'REGISTER',
        payload: {
          name: this.state.name,
          email: this.state.email,
          password: this.state.password,
        },
      });
    } else {
      this.props.dispatch({ type: 'REGISTRATION_INPUT_ERROR' });
    }
  } // end registerUser

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  render() {
    return (
      <div>
        {this.props.errors.registrationMessage && (
          <h2
            className="alert"
            role="alert"
          >
            {this.props.errors.registrationMessage}
          </h2>
        )}
        <form onSubmit={this.registerUser}>
          <h1>Register User</h1>
          <div>
            <label htmlFor="name">
              Full Name:
              <Input
                type="text"
                name="fullname"
                value={this.state.name}
                onChange={this.handleInputChangeFor('name')}
              />
            </label>
            </div>
            <div>
            <label htmlFor="email">
              Email:
              <Input
                type="text"
                name="email"
                value={this.state.username}
                onChange={this.handleInputChangeFor('email')}
              />
            </label>
          </div>
          <div>
            <label htmlFor="password">
              Password:
              <Input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleInputChangeFor('password')}
              />
            </label>
          </div>
          <div>
            <input
              className="register"
              type="submit"
              name="submit"
              value="Register"
            />
          </div>
        </form>
        <center>
          <button
            type="button"
            className="link-button"
            onClick={() => { this.props.dispatch({ type: 'SET_TO_LOGIN_MODE' }) }}
          >
            Login
          </button>
        </center>
      </div>
    );
  }
}

// Instead of taking everything from state, we just want the error messages.
// if you wanted you could write this code like this:
// const mapStateToProps = ({errors}) => ({ errors });
const mapStateToProps = state => ({
  errors: state.errors,
});

export default withRouter(connect(mapStateToProps)(RegisterPage));

