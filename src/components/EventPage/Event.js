import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import GeoCode from "react-geocode"

class EventPage extends Component {
    state = {
        newLocation: {
            street: '',
            apt: '',
            city: '',
            state: '',
            zipCode: ''
        },
        location: {
            lat: 0,
            lng: 0
        },
        eventID: '',
        attending: {
            name: '',
            bringing: '',
        }
    }

    componentDidMount() {
        this.getDetails();
    }

    componentDidUpdate(preProps){
        if(this.props.reduxState.attendingList.length !== preProps.reduxState.attendingList.length){
            this.setDetails();
        }
    }

    getDetails = () => {
        this.props.dispatch({ type: "GET_SINGLE_EVENT", payload: this.props.match.params.id })
        this.props.dispatch({ type: 'GET_LIST', payload: this.props.match.params.id })
        this.props.dispatch({ type: 'GET_ATTENDING', payload: this.props.match.params.id});
    }

    setDetails = () => {
        this.props.reduxState.singleEvent.forEach((event) => {
            this.setState({
                newLocation: {
                    street: event.street,
                    apt: event.apt,
                    city: event.city,
                    state: event.state,
                    zipCode: event.zip_code
                },
                eventID: event.id
            })
        })
        console.log(this.state);

        this.getLatAndLng()
    }

    getLatAndLng = () => {
        let address;
        if (this.state.newLocation.apt === '') {
            address = {
                street: this.state.newLocation.street,
                apt: '1',
                city: this.state.newLocation.city,
                state: this.state.newLocation.state,
                zipCode: this.state.newLocation.zipCode
            }
        } else {
            address = this.state.newLocation
        }
        // GeoCode.setApiKey(process.env.REACT_APP_API_KEY)
        GeoCode.fromAddress(
            JSON.stringify(address)
        )
            .then(result => {
                const { lat, lng } = result.results[0].geometry.location;
                this.setState({
                    location: {
                        lat: lat,
                        lng: lng
                    }
                });
                console.log(this.state.location)
            },
                error => {
                    console.error(error);
                }
            );
    }

    editBtn = () => {
        this.props.history.push(`/editevent/${this.props.match.params.id}`)
    }

    deleteBtn = () => {
        if (window.confirm("Are you sure you want to delete?")) {
            this.props.dispatch({ type: "DELETE_EVENT", payload: this.state.eventID })
            this.props.dispatch({ type: 'GET_EVENTS', payload: this.props.reduxState.user.id });
            this.props.history.push('/private');
        }
    }

    handelChange = (e, propertyName)=>{
        this.setState({
            attending:{
                ...this.state.attending,
                [propertyName]: e.target.value

            }
        })
    }

    rsvpBtn = ()=>{
        console.log(this.state.eventID)
        this.props.dispatch({type:'ADD_ATTENDING', payload: {id: this.props.match.params.id, person: this.state.attending}})
        this.getDetails();
        this.setState({
            attending: {
                name: '',
                bringing: '',
            }
        })
    }

    deletePerson = (id)=>{
        this.props.dispatch({type: "DELETE_ATTENDING", payload: id});
        this.getDetails();
    }

    render() {
        return (
            <>
                {this.props.reduxState.singleEvent.map((event) => {
                    return (
                        <div key={event.id}>
                            <h2>{event.event_name}</h2>
                            <p>{event.description}</p>
                        </div>
                    )
                })}
                <div>
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
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div>
                    <h3>Are you able to make it?</h3>
                    <label>Name:</label>
                    <input value={this.state.attending.name} onChange={(e)=> this.handelChange(e,'name')}/>
                    <br/>
                    <label>Bringing</label>
                    <input value={this.state.attending.bringing} onChange={(e)=> this.handelChange(e,'bringing')}/>
                    <br/>
                    <button onClick={this.rsvpBtn}>RSVP</button>
                    <h3>Attending:</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Bringing</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.reduxState.attendingList.map((person)=>{
                                return(
                                    <tr key={person.id}>
                                        <td>{person.name}</td>
                                        <td>{person.item}</td>
                                        <td><button onClick={() => this.deletePerson(person.id)}>Delete</button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                {this.props.reduxState.singleEvent.map((event) => {
                    return (
                        <div key={event.id}>
                            <p>{event.street}</p>
                            <p>{event.apt}</p>
                            <p>{event.city}</p>
                            <p>{event.state}</p>
                            <p>{event.zip_code}</p>
                        </div>
                    )
                })}
                <LoadScript
                    id="script-loader"
                    // googleMapsApiKey={process.env.REACT_APP_API_KEY}
                    onLoad={this.setDetails}
                >
                    <GoogleMap
                        className="example-map"
                        mapContainerStyle={{
                            height: "300px",
                            width: "300px"
                        }}
                        zoom={15}
                        center={{
                            lat: this.state.location.lat,
                            lng: this.state.location.lng
                        }}
                    >
                        <Marker
                            position={{
                                lat: this.state.location.lat,
                                lng: this.state.location.lng
                            }}
                        >
                        </Marker>
                    </GoogleMap>
                </LoadScript>
                <button onClick={this.editBtn}>Edit</button>
                <button onClick={() => this.deleteBtn()}>Delete</button>
            </>
        )
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState
});

export default withRouter(connect(mapReduxStateToProps)(EventPage));