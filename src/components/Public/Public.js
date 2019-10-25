import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Card, Grid, Modal, Header, Icon } from 'semantic-ui-react';
import './Public.css'
import logo from '../Logo/Eventure-1.png'


class Public extends Component {
  componentDidMount() {
    this.props.dispatch({ type: 'GET_PUBLIC_EVENTS' })
  }

  publicEventPage = (id) => {
    this.props.history.push(`/public/${id}`)
  }

  handelEdit = (id) => {
    this.props.history.push(`/publicEdit/${id}`)
  }

  handelDelete = (boolean, id) => {
    if (boolean) {
      this.props.dispatch({ type: "DELETE_EVENT", payload: id })
      this.props.dispatch({ type: 'GET_PUBLIC_EVENTS' })
      this.props.history.push('/public');
    }
  }
  render() {
    return (
      <div>
        <div className="imgHeadder" >
          <h1>Welcome to</h1>
          <img className="EventListPage" src={logo} alt="logo" />
          <h2>The one stop for your party planning needs</h2>
        </div>
        <div className="headder">
          <h1>
            Check out events in your area
        </h1>
        </div>
        <div className="eventPage">
          <Grid stackable relaxed divided='vertically'>
            <Grid.Row columns={4} >
              {this.props.reduxState.publicEvents.map((event) => {
                return (
                  <Grid.Column width={4} key={event.id}>
                    <Card fluid >
                      <Card.Content >
                        <Card.Header>{event.event_name}</Card.Header>
                        <Card.Meta>{event.city}, {event.state}</Card.Meta>
                        <Card.Description>{event.description}</Card.Description>
                      </Card.Content>
                      <Card.Content extra textAlign="center">
                        <Button onClick={() => this.publicEventPage(event.id)} color="orange">More Info</Button>
                      </Card.Content>
                    </Card>
                    {
                      this.props.reduxState.user.admin_level === 1 ?
                        <>
                          <Button onClick={() => this.handelEdit(event.id)} color="teal">Edit</Button>
                          <Modal trigger={<Button>Delete</Button>} basic closeIcon>
                            <Header content="Delete?" />
                            <Modal.Content>
                              <p>
                                Are you sure you want to delete?
                              </p>
                            </Modal.Content>
                            <Modal.Actions>
                              <Button onClick={() => this.handelDelete(true,event.id)} basic color="green" >
                                <Icon name="checkmark" inverted /> Yes
                              </Button>
                            </Modal.Actions>
                          </Modal>
                        </>
                        :
                        ""
                    }
                  </Grid.Column>

                )
              })}
            </Grid.Row>
          </Grid>
        </div>
      </div >
    )
  }
}


const mapReduxStateToProps = (reduxState) => ({
  reduxState
});

export default withRouter(connect(mapReduxStateToProps)(Public));