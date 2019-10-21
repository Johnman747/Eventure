import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

// This is one of our simplest components
// It doesn't have local state, so it can be a function component.
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is, so it doesn't need 'connect()'

class Public extends Component {
  componentDidMount() {
    this.props.dispatch({ type: 'GET_PUBLIC_EVENTS' })
  }

  publicEventPage = (id)=>{
    this.props.history.push(`/public/${id}`)
  }

  handelEdit = (id)=>{
    this.props.history.push(`/publicEdit/${id}`)
  }

  handelDelete = (id)=>{
    if (window.confirm("Are you sure you want to delete?")) {
      this.props.dispatch({ type: "DELETE_EVENT", payload: id})
      this.props.dispatch({ type: 'GET_PUBLIC_EVENTS' })
      this.props.history.push('/public');
  }
  }
  render() {
    return (
      <div>
        <div>
          <p>
            This Public page is for anyone to read!
            </p>
          {this.props.reduxState.publicEvents.map((event) => {
            return (
              <div key={event.id} >
                <div onClick={()=>this.publicEventPage(event.id)}>
                <h2>{event.event_name}</h2>
                <p>{event.description}</p>
                </div>
                {this.props.reduxState.user.admin_level === 1?
                <>
                <button onClick={()=>this.handelEdit(event.id)}>Edit</button>
                <button onClick={()=>this.handelDelete(event.id)}>Delete</button>
                </>
                :
                ""
                }
              </div>
            )
          })}

        </div>
      </div>
    )
  }
}


const mapReduxStateToProps = (reduxState) => ({
  reduxState
});

export default withRouter(connect(mapReduxStateToProps)(Public));