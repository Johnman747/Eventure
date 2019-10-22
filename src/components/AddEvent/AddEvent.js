import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import "./AddEvent.css"
import {Input, Button, Checkbox, TextArea} from 'semantic-ui-react';

class AddEvent extends Component {
    state = {
        event: {
            eventName: '',
            hostID: this.props.user.id,
            description: '',
            street: '',
            apt: '',
            city: '',
            state: '',
            zip: '',
            public: false,
        },
        addGuestList: {
            name: '',
            email: ''
        },
        list: []
    }

    handelChange = (e, propertyName) => {
        this.setState({
            event: {
                ...this.state.event,
                [propertyName]: e.target.value
            }
        })
    }

    makePublic = () => {
        let check = !this.state.event.public
        this.setState({
            event: {
                ...this.state.event,
                public: check
            }
        })
        console.log(this.state.event.puclic)
    }

    setEvent = () => {
        this.setState({
            event: {
                eventName: 'Johns Party',
                hostID: this.props.user.id,
                description: 'Party at Johns house. WhiteClaws will be present so..... NO LAWS BABY!!!',
                street: '137 Fairview Ave N',
                apt: '1',
                city: 'St Paul',
                state: 'MN',
                zip: '55104',
            }
        })
    }

    handelAddEvent = (event) => {
        event.preventDefault();
        this.props.dispatch({ type: 'ADD_EVENT', payload: this.state })
        this.props.dispatch({ type: 'GET_EVENTS', payload: this.props.user.id });
        this.props.dispatch({type: 'SEND_INVITES', payload: this.state.list});
        this.setState({
            event: {
                eventName: '',
                hostID: this.props.user.id,
                description: '',
                street: '',
                apt: '',
                city: '',
                state: '',
                zip: '',
                public: false
            },
            list: [],
        })
        this.props.history.push('/private')
        // console.log(this.state.event)
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
        this.state.list.push(this.state.addGuestList);
        this.setState({
            addGuestList: {
                name: '',
                email: ''
            }
        })
    }

    render() {
        return (
            <div className="addevent">
                <div className="eventDetails">
                    <h1><span onClick={this.setEvent}>Add</span> Event</h1>
                    <h4>Event Name</h4>
                    <Input value={this.state.event.eventName} onChange={(e) => this.handelChange(e, "eventName")} />
                    <h4>Description</h4>
                    <TextArea rows="5" value={this.state.event.description} onChange={(e) => this.handelChange(e, "description")} />
                    <h4>Add Guests</h4>
                    <Input label="Name" value={this.state.addGuestList.name} onChange={(e) => { this.addGuestToList(e, "name") }} />
                    <br />
                    <Input label="Email" value={this.state.addGuestList.email} onChange={(e) => { this.addGuestToList(e, "email") }} />
                    <br />
                    <Button onClick={this.addGuest}>Add Guest</Button>
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
                            {this.state.list.map((person, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{person.name}</td>
                                        <td>{person.email}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="address">
                    <h4>Address:</h4>                    <Input label="Street" value={this.state.event.street} onChange={(e) => this.handelChange(e, "street")} />
                    <br />
                    <Input label="Apt" value={this.state.event.apt} onChange={(e) => this.handelChange(e, "apt")} />
                    <br />
                    <Input label="City" value={this.state.event.city} onChange={(e) => this.handelChange(e, "city")} />
                    <br />
                    <Input label="State" value={this.state.event.state} onChange={(e) => this.handelChange(e, "state")} />
                    <br />
                    <Input label="Zip Code" value={this.state.event.zip} onChange={(e) => this.handelChange(e, "zip")} />
                </div>
                <br />
                <Checkbox label="Make Public" type="checkbox" onClick={this.makePublic} />
                <br />
                <Button onClick={this.handelAddEvent}>Add Event</Button>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    user: state.user,
});

// this allows us to use <App /> in index.js
export default withRouter(connect(mapStateToProps)(AddEvent));