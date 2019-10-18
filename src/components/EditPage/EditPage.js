import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

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
                    <input value={this.state.event.eventName} onChange={(e) => this.handelChange(e, "eventName")} />
                    <h4>Description</h4>
                    <textarea value={this.state.event.description} rows="5" onChange={(e) => this.handelChange(e, "description")} />
                    <h4>Add Guests</h4>
                    <input value={this.state.addGuestList.name} onChange={(e) => this.addGuestToList(e, "name")} />
                    <br />
                    <input value={this.state.addGuestList.email} onChange={(e) => this.addGuestToList(e, "email")} />
                    <br />
                    <button onClick={this.addGuest}>Add Guest</button>
                </div>
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
                                        <td><button onClick={() => this.deletePerson(person.id)}>Delete</button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="address">
                    <h4>Address:</h4>
                    <label>Street:</label>
                    <input value={this.state.event.street} onChange={(e) => this.handelChange(e, "street")} />
                    <br />
                    <label>Apt:</label>
                    <input value={this.state.event.apt} onChange={(e) => this.handelChange(e, "apt")} />
                    <br />
                    <label>City:</label>
                    <input value={this.state.event.city} onChange={(e) => this.handelChange(e, "city")} />
                    <br />
                    <label>State:</label>
                    <input value={this.state.event.state} onChange={(e) => this.handelChange(e, "state")} />
                    <br />
                    <label>Zip Code:</label>
                    <input value={this.state.event.zip} onChange={(e) => this.handelChange(e, "zip")} />
                </div>
                <br />
                <button onClick={this.handelUpdateEvent}>Update Event</button>
            </div>
        )
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState
});

export default withRouter(connect(mapReduxStateToProps)(EditEvent));
