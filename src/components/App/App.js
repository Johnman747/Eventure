import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import { connect } from 'react-redux';

import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'

import PublicPage from '../Public/Public';
import UserPage from '../UserPage/UserPage';
import PrivatePage from '../PrivatePage/PrivatePage';
import AddEvent from '../AddEvent/AddEvent';
import EventPage from '../EventPage/Event';
import EditEvent from '../EditPage/EditPage';
import PublicEventPage from '../PublicEventPage/PublicEventPage';
import EditPublic from '../EditPublic/EditPublic';

import './App.css';

class App extends Component {
  componentDidMount() {
    this.props.dispatch({ type: 'FETCH_USER' })
  }

  render() {
    return (
      <Router>
        <div>
          <Nav />
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/public */}
            <Redirect exact from="/" to="/public" />
            {/* Visiting localhost:3000/about will show the about page.
            This is a route anyone can see, no login necessary */}
            <Route
              exact
              path="/public"
              component={PublicPage}
            />
            <Route 
            exact
            path="/publicEdit/:id"
            render={({match})=><EditPublic match={match}/>}
            />
            <Route
              path='/event/:id'
              render={({ match }) => <EventPage match={match} />}
            />
            <Route
              path='/public/:id'
              render={({ match }) => <PublicEventPage match={match} />}
              />
              {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/home will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the 'Login' or 'Register' page.
            Even though it seems like they are different pages, the user is always on localhost:3000/home */}
              {/* This works the same as the other protected route, except that if the user is logged in,
            they will see the info page instead. */}
            <ProtectedRoute
            exact
            path="/addevent"
            render={({match})=><AddEvent match={match}/>}
            />
            <ProtectedRoute
              exact
              path="/editevent/:id"
              render={({ match }) => <EditEvent match={match} />}
            />
            <ProtectedRoute
              exact
              path="/private"
              component={PrivatePage}
            />
            <ProtectedRoute
              exact
              path="/home"
              component={UserPage}
            />
            {/* If none of the other routes matched, we will show a 404. */}
            <Route render={() => <h1>404</h1>} />
          </Switch>
          <Footer />
        </div>
      </Router>
    )
  }
}

export default connect()(App);
