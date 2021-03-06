import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import name from '../Logo/logo-name.png'
// import logo from '../Logo/Eventure.png'

const Nav = (props) => (
  <div className="nav">
    <div className="nav-logo">
      <img className="headder-logo" src={name} alt="name" />
    </div>
    {/* Always show this link since the about page is not protected */}
    <div className="nav-right">
      <Link className="nav-link" to="/public">
        Public
      </Link>
      {/* Show the link to the info page and the logout button if the user is logged in */}
      {props.user.id && (
        <>
          <Link className="nav-link" to='/addevent'>
            Add Event
        </Link>
          <Link className="nav-link" to="/private">
            Private
          </Link>
          <LogOutButton className="nav-link" />
        </>
      )}
      <Link className="nav-link" to="/home">
        {/* Show this link if they are logged in or not,
        but call this link 'Home' if they are logged in,
        and call this link 'Login / Register' if they are not */}
        {props.user.id ? 'User' : 'Login / Register'}
      </Link>
    </div>
  </div>
);

// Instead of taking everything from state, we just want the user
// object to determine if they are logged in
// if they are logged in, we show them a few more links 
// if you wanted you could write this code like this:
// const mapStateToProps = ({ user }) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(Nav);
