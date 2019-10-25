import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Button, Card,Grid  } from 'semantic-ui-react';
import './PrivatePage.css'

class PrivatePage extends Component {

  componentDidMount() {
    this.getPrivateEvents();
  }

  componentDidUpdate(preProps) {
    if (this.props.reduxState.privateEvents.length !== preProps.reduxState.privateEvents.length) {
      this.getPrivateEvents();
    }
  }

  getPrivateEvents = () => {
    this.props.dispatch({ type: 'GET_EVENTS', payload: this.props.reduxState.user.id });
  }

  moveToDetails = (id) => {
    this.props.dispatch({ type: "GET_SINGLE_EVENT", payload: id })
    this.props.history.push(`/event/${id}`)
  }
  render() {
    return (
      <>
      <div className="headder">
        <h1>
          Your Private Events
        </h1>
        </div>
        <div className="eventPage">
          <Grid stackable relaxed divided='vertically'>
            <Grid.Row columns={4} >
            {this.props.reduxState.privateEvents.map((event) => {
              return (
                <Grid.Column width={4} key={event.id}>
                <Card fluid >
                  <Card.Content >
                    <Card.Header>{event.event_name}</Card.Header>
                    <Card.Meta>{event.city}, {event.state}</Card.Meta>
                    <Card.Description>{event.description}</Card.Description>
                  </Card.Content>
                  <Card.Content extra textAlign="center">
                    <Button onClick={() => this.moveToDetails(event.id)} color="orange">More Info</Button>
                  </Card.Content>
                </Card>
                </Grid.Column>
              )
            })}
            </Grid.Row>
          </Grid>
          </div>
      </>
    )
  }
}

const mapReduxStateToProps = (reduxState) => ({
  reduxState
});

// this allows us to use <App /> in index.js
export default connect(mapReduxStateToProps)(PrivatePage);
