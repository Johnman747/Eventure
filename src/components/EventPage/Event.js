import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import GeoCode from "react-geocode"
import { Table, Button, Input, Label, Grid } from 'semantic-ui-react';
import './Event.css'

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
        hostid: '',
        attending: {
            name: '',
            bringing: '',
        }
    }

    componentDidMount() {
        this.getDetails();
    }

    componentDidUpdate(preProps) {
        if (this.props.reduxState.attendingList.length !== preProps.reduxState.attendingList.length) {
            this.props.dispatch({ type: 'GET_ATTENDING', payload: this.props.match.params.id });
        }
        if (this.props.reduxState.singleEvent !== preProps.reduxState.singleEvent) {
            this.setDetails();
        }
    }

    getDetails = () => {
        this.props.dispatch({ type: "GET_SINGLE_EVENT", payload: this.props.match.params.id })
        this.props.dispatch({ type: 'GET_LIST', payload: this.props.match.params.id })
        this.props.dispatch({ type: 'GET_ATTENDING', payload: this.props.match.params.id });
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
                eventID: event.id,
                hostid: event.host_id,
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

    handelChange = (e, propertyName) => {
        this.setState({
            attending: {
                ...this.state.attending,
                [propertyName]: e.target.value

            }
        })
    }

    rsvpBtn = () => {
        console.log(this.state.eventID)
        this.props.dispatch({ type: 'ADD_ATTENDING', payload: { id: this.props.match.params.id, person: this.state.attending } })
        this.getDetails();
        this.setState({
            attending: {
                name: '',
                bringing: '',
            }
        })
    }

    deletePerson = (id) => {
        this.props.dispatch({ type: "DELETE_ATTENDING", payload: id });
        this.getDetails();
    }

    render() {
        return (
            <div className="container">
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
                    <div className="table2">
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell width="10">Name</Table.HeaderCell>
                                    <Table.HeaderCell width="16">Email</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.props.reduxState.list.map((person) => {
                                    return (
                                        <Table.Row key={person.id}>
                                            <Table.Cell >{person.name}</Table.Cell>
                                            <Table.Cell >{person.email}</Table.Cell>
                                        </Table.Row>
                                    )
                                })}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
                <div className="attending">
                    <h3>Are you able to make it?</h3>
                    <label className="name_label">Name: </label>
                    <Input className="name_input" value={this.state.attending.name} onChange={(e) => this.handelChange(e, 'name')} />
                    <br />
                    <label>Bringing: </label>
                    <Input className="name_input" value={this.state.attending.bringing} onChange={(e) => this.handelChange(e, 'bringing')} />
                    <br />
                    <Button onClick={this.rsvpBtn}>RSVP</Button>
                    <h3>Attending:</h3>
                    <div className="table">
                        <Table >
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell width="2">Name</Table.HeaderCell>
                                    <Table.HeaderCell width="2">Bringing</Table.HeaderCell>
                                    <Table.HeaderCell width="2"></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.props.reduxState.attendingList.map((person) => {
                                    return (
                                        <Table.Row key={person.id}>
                                            <Table.Cell width="2">{person.name}</Table.Cell>
                                            <Table.Cell width="2">{person.item}</Table.Cell>
                                            <Table.Cell width="2"><Button onClick={() => this.deletePerson(person.id)}>Delete</Button></Table.Cell>
                                        </Table.Row>
                                    )
                                })}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
                <div className="address_map">
                    <Grid stackable relaxed divided='vertically' columns='2'>
                        <Grid.Row>
                            <Grid.Column>
                                <LoadScript
                                    id="script-loader"
                                    onLoad={this.setDetails}
                                    googleMapsApiKey={process.env.REACT_APP_API_KEY}
                                >
                                    <div className="example-map">
                                        <GoogleMap
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
                                    </div>
                                </LoadScript>
                            </Grid.Column>
                            <div className="address">
                                <Grid.Column >
                                    {this.props.reduxState.singleEvent.map((event) => {
                                        return (
                                            <div key={event.id}>
                                                <p>{event.street} {event.apt}</p>
                                                <p>{event.city},{event.state}</p>
                                                <p>{event.zip_code}</p>
                                            </div>
                                        )
                                    })}
                                </Grid.Column>
                            </div>
                        </Grid.Row>
                    </Grid>
                </div>

                <div className="buttons">
                    {this.props.reduxState.user.id === this.state.hostid ?
                        <>
                            <Button onClick={this.editBtn}>Edit</Button>
                            <Button onClick={() => this.deleteBtn()}>Delete</Button>
                        </>
                        :
                        ''
                    }
                </div>
            </div>
        )
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState
});

export default withRouter(connect(mapReduxStateToProps)(EventPage));