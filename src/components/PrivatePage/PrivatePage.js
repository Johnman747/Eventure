import React, { Component } from 'react';
import { connect } from 'react-redux';

class PrivatePage extends Component {

  componentDidMount() {
    this.getPrivateEvents();
  }

  componentDidUpdate(preProps){
    if(this.props.reduxState.privateEvents.length !== preProps.reduxState.privateEvents.length){
      this.getPrivateEvents();
    }
  }

  getPrivateEvents = () => {
    this.props.dispatch({ type: 'GET_EVENTS', payload: this.props.reduxState.user.id });
  }

  moveToDetails = (id)=>{
    this.props.dispatch({type: "GET_SINGLE_EVENT", payload: id})
    this.props.history.push(`/event/${id}`)
  }
  render() {
    return (
      <div>
        <h1>
          Private Events Page
        </h1>
        {this.props.reduxState.privateEvents.map((event) => {
            return (
              <div key={event.id} onClick={()=>this.moveToDetails(event.id)}>
                <h2>{event.event_name}</h2>
                <p>{event.description}</p>
              </div>
            )
          })}
      </div>
    )
  }
}

const mapReduxStateToProps = (reduxState) => ({
  reduxState
});

// this allows us to use <App /> in index.js
export default connect(mapReduxStateToProps)(PrivatePage);
