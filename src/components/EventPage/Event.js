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
        eventID: ''
    }

    componentDidMount() {
        this.getDetails();
    }

    getDetails = () => {
        this.props.dispatch({ type: "GET_SINGLE_EVENT", payload: this.props.match.params.id })
    }

    setDetails = () => {
        this.props.reduxState.singleEvent.forEach((event)=>{
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
        
        // this.getLatAndLng()
    }

    getLatAndLng = ()=>{
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
        GeoCode.setApiKey(process.env.REACT_APP_API_KEY)
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

    editBtn = ()=>{
        this.props.history.push(`/editevent/${this.props.match.params.id}`)
    }

    render() {
        return (
            <>
                {this.props.reduxState.singleEvent.map((event) => {
                    return (
                        <div key={event.id}>
                            <h2>{event.event_name}</h2>
                            <p>{event.description}</p>
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
                <button>Delete</button>
            </>
        )
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState
});

export default withRouter(connect(mapReduxStateToProps)(EventPage));