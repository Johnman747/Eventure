import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import {Input, TextArea, Button } from 'semantic-ui-react';
import "./EditPublic.css"

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
    }

    componentDidMount() {
        this.fetchDetails();
    }

    componentDidUpdate(preProps) {
        if (this.props.reduxState.singleEvent !== preProps.reduxState.singleEvent) {
            this.getDetails()
        }
    }

    fetchDetails = () => {
        this.props.dispatch({ type: "GET_SINGLE_EVENT", payload: this.props.match.params.id })
    }

    getDetails = () => {
        console.log("set details");

        this.props.reduxState.singleEvent.forEach((event) => {
            this.setState({
                event: {
                    id: event.id,
                    eventName: event.event_name,
                    hostID: event.host_id,
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
        this.props.dispatch({ type: 'GET_PUBLIC_EVENTS' })
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
        this.props.history.push(`/public`)
    }


    render() {
        return (
            <div className="addevent">
                <div className="eventDetails">
                    <h1>Edit Event</h1>
                    <h4>Event Name</h4>
                    <Input value={this.state.event.eventName} onChange={(e) => this.handelChange(e, "eventName")} />
                    <h4>Description</h4>
                    <TextArea className="text_area_public" value={this.state.event.description} rows="5" onChange={(e) => this.handelChange(e, "description")} />
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
