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
        guestList: {
            name: '',
            email: ''
        }
    }

    componentDidMount() {
        this.props.dispatch({ type: "GET_SINGLE_EVENT", payload: this.props.match.params.id })
        this.getDetails()
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
        // console.log(this.state.event)
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
                    <input />
                    <br />
                    <input />
                    <br />
                    <button>Add Guest</button>
                </div>
                <div className="guestList">
                    <h4>Guests:</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Jon Doe</td>
                                <td>jon.doe@email.com</td>
                            </tr>
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
