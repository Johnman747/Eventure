import React, { Component } from 'react';
import { connect } from 'react-redux';
import "./AddEvent.css"

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
        },
        guestList: {
            name: '',
            email: ''
        }
    }

    handelChange = (e, propertyName) => {
        this.setState({
            event: {
                ...this.state.event,
                [propertyName]: e.target.value
            }
        })
    }

    setEvent = ()=>{
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
        this.props.dispatch({type: 'ADD_EVENT', payload: this.state})
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
            }
        })
        this.props.history.push('/private')
        // console.log(this.state.event)
    }

    render() {
        return (
            <div className="addevent">
                <div className="eventDetails">
                    <h1><span onClick={this.setEvent}>Add</span> Event</h1>
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
                <button onClick={this.handelAddEvent}>Add Event</button>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    user: state.user,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(AddEvent);