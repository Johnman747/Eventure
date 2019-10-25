import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import GeoCode from "react-geocode"
import { Button, Input, Grid, Header, Modal, Icon } from 'semantic-ui-react';
import { Table, TableRow, TableBody, TableCell, TableHead } from "@material-ui/core";
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
            this.setState({ state: this.state })
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

    deleteBtn = (boolean) => {
        if (boolean) {
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
                            <TableHead>
                                <TableRow>
                                    <TableCell >Name</TableCell>
                                    <TableCell >Email</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.props.reduxState.list.map((person) => {
                                    return (
                                        <TableRow key={person.id}>
                                            <TableCell >{person.name}</TableCell>
                                            <TableCell >{person.email}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
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
                    <Button onClick={this.rsvpBtn} color="purple">RSVP</Button>
                    <h3>Attending:</h3>
                    <div className="table">
                        <Table >
                            <TableHead>
                                <TableRow>
                                    <TableCell width="2">Name</TableCell>
                                    <TableCell width="2">Bringing</TableCell>
                                    <TableCell width="2"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.props.reduxState.attendingList.map((person) => {
                                    return (
                                        <TableRow key={person.id}>
                                            <TableCell width="2">{person.name}</TableCell>
                                            <TableCell width="2">{person.item}</TableCell>
                                            <TableCell width="2"><Button onClick={() => this.deletePerson(person.id)} color="red">Delete</Button></TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className="address_map">
                    <Grid stackable relaxed divided='vertically' columns='2'>
                        <Grid.Row>
                            <Grid.Column>
                                <LoadScript
                                    id="script-loader"
                                    googleMapsApiKey={process.env.REACT_APP_API_KEY}
                                // onLoad={this.setDetails}
                                >
                                    <div className="example-map">
                                        <GoogleMap
                                            onLoad={this.setDetails}
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
                                                <h5>{event.street} {event.apt}</h5>
                                                <h5>{event.city},{event.state}</h5>
                                                <h5>{event.zip_code}</h5>
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
                            <Button onClick={this.editBtn} color="teal">Edit</Button>
                            <Modal trigger={<Button color="red">Delete</Button>} size="small" basic closeIcon>
                                <Header content="Delete?" />
                                <Modal.Content>
                                    <p>
                                        Are you sure you want to delete?
                                    </p>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button onClick={() => this.deleteBtn(true)} basic color="green" >
                                        <Icon name="checkmark" inverted /> Yes
                                    </Button>
                                </Modal.Actions>
                            </Modal>
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