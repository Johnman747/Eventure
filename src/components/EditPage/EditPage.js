import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import {Input, TextArea, Button} from 'semantic-ui-react';

class EditEvent extends Component {
    state = {
        event: {
            id: '',
            eventName: '',
            hostID: this.props.reduxState.user.id,
            description: '',
            street: '',
            apt: '',
            city: '',
            state: '',
            zip: '',
        },
        addGuestList: {
            id: '',
            name: '',
            email: ''
        },
        list: []
    }

    componentDidMount() {
        this.fetchDetails();
    }

    componentDidUpdate(preProps) {
        if (this.props.reduxState.singleEvent !== preProps.reduxState.singleEvent) {
            this.getDetails()
        }
        if (this.props.reduxState.list.length !== preProps.reduxState.list.length) {
            this.fetchDetails()
        }
    }

    fetchDetails = () => {
        this.props.dispatch({ type: "GET_SINGLE_EVENT", payload: this.props.match.params.id })
        this.props.dispatch({ type: 'GET_LIST', payload: this.props.match.params.id })
    }

    getDetails = () => {
        console.log("set details");

        this.props.reduxState.singleEvent.forEach((event) => {
            this.setState({
                event: {
                    id: event.id,
                    eventName: event.event_name,
                    hostID: this.props.reduxState.user.id,
                    description: event.description,
                    street: event.street,
                    apt: event.apt,
                    city: event.city,
                    state: event.state,
                    zip: event.zip_code,
                },
                addGuestList: {
                    id: event.id
                }
            })
        })
    }

    handelChange = (e, propertyName) => {
        this.setState({
            event: {
                ...this.state.event,
                [propertyName]: e.target.value
            }
        })
    }


    handelUpdateEvent = (event) => {
        event.preventDefault();
        this.props.dispatch({ type: 'UPDATE_EVENT', payload: this.state })
        this.props.dispatch({ type: 'GET_EVENTS', payload: this.props.reduxState.user.id });
        this.props.dispatch({ type: "GET_SINGLE_EVENT", payload: this.props.match.params.id })
        this.setState({
            event: {
                id: '',
                eventName: '',
                hostID: '',
                description: '',
                street: '',
                apt: '',
                city: '',
                state: '',
                zip: '',
            }
        })
        this.props.history.push(`/event/${this.props.match.params.id}`)
    }

    addGuestToList = (e, propertyName) => {
        this.setState({
            addGuestList: {
                ...this.state.addGuestList,
                [propertyName]: e.target.value
            }
        })
    }

    addGuest = () => {
        this.props.dispatch({ type: 'ADD_GUEST', payload: this.state.addGuestList })
        this.fetchDetails()
        this.setState({
            addGuestList: {
                name: '',
                email: ''
            }
        })
    }

    deletePerson = (id) => {
        this.props.dispatch({ type: 'DELETE_PERSON_INVITED', payload: id })
        this.fetchDetails()
    }

    render() {
        return (
            <div className="addevent">
                <div className="eventDetails">
                    <h1>Edit Event</h1>
                    <h4>Event Name</h4>
                    <Input value={this.state.event.eventName} onChange={(e) => this.handelChange(e, "eventName")} />
                    <h4>Description</h4>
                    <TextArea className="text_area" value={this.state.event.description} rows="5" onChange={(e) => this.handelChange(e, "description")} />
                    <h4>Add Guests</h4>
                    <Input value={this.state.addGuestList.name} onChange={(e) => this.addGuestToList(e, "name")} />
                    <br />
                    <Input value={this.state.addGuestList.email} onChange={(e) => this.addGuestToList(e, "email")} />
                    <br />
                    <Button onClick={this.addGuest}>Add Guest</Button>
                </div>
                <br/>
                <div className="guestList">
                    <h3>Invited List:</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.reduxState.list.map((person) => {
                                return (
                                    <tr key={person.id}>
                                        <td>{person.name}</td>
                                        <td>{person.email}</td>
                                        <td><Button onClick={() => this.deletePerson(person.id)}>Delete</Button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="address">
                    <h4>Address</h4>
                    <Input className="street" label="Street" value={this.state.event.street} onChange={(e) => this.handelChange(e, "street")} />
                    <br />
                    <Input className="apt" label="Apt" value={this.state.event.apt} onChange={(e) => this.handelChange(e, "apt")} />
                    <br />
                    <Input className="city" label="City" value={this.state.event.city} onChange={(e) => this.handelChange(e, "city")} />
                    <br />
                    <Input className="state" label="State" value={this.state.event.state} onChange={(e) => this.handelChange(e, "state")} />
                    <br />
                    <Input className="zip" label="Zip Code" value={this.state.event.zip} onChange={(e) => this.handelChange(e, "zip")} />
                </div>
                <br />
                <Button onClick={this.handelUpdateEvent}>Update Event</Button>
            </div>
        )
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState
});

export default withRouter(connect(mapReduxStateToProps)(EditEvent));
