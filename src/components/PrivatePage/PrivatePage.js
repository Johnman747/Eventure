import React, { Component } from 'react';
import { connect } from 'react-redux';

class PrivatePage extends Component {

  componentDidMount() {
    this.getPrivateEvents();
  }

  getPrivateEvents = () => {
    this.props.dispatch({ type: 'GET_EVENTS', payload: this.props.reduxState.user.id });
  }
  render() {
    return (
      <div>
        <h1>
          Private Events Page
        </h1>
        {this.props.reduxState.privateEvents.map((event) => {
            return (
              <div key={event.id}>
                <h2>{event.event_name}</h2>
                <p>{event.description}</p>
              </div>
            )
          })}
          {JSON.stringify(this.props.reduxState.privateEvents.data)}
      </div>
    )
  }
}

const mapReduxStateToProps = (reduxState) => ({
  reduxState
});

// this allows us to use <App /> in index.js
export default connect(mapReduxStateToProps)(PrivatePage);
