import axios from 'axios';
import { takeEvery, put } from 'redux-saga/effects';

function* addEvent(action) {
    try {
        yield axios.post('/api/event/addevent', action.payload)
    } catch (err) {
        console.log(err);
    }
}

function* getEvents(action) {
    try {
        const response = yield axios.get(`/api/event/private/${action.payload}`)
        yield put({ type: 'SET_PRIVATE_EVENTS', payload: response.data })
    } catch (err) {
        console.log(err);
    }
}

function* getSingleEvent(action) {
    try {
        const response = yield axios.get(`/api/event/single/${action.payload}`)
        yield put({ type: 'SET_SINGLE_EVENT', payload: response.data })
    } catch (err) {
        console.log(err);
    }
}

function* updateEvent(action) {
    try {
        yield axios.put('/api/event/update', action.payload)
    } catch (err) {
        console.log(err);
    }
}

function* deleteEvent(action) {
    try {
        yield axios.delete(`/api/event/${action.payload}`)
    } catch (err) {
        console.log(err);
    }
}

function* publicEvents(action) {
    try {
        const response = yield axios.get('/api/event/public');
        yield put({ type: 'SET_PUBLIC_EVENTS', payload: response.data });
    } catch (err) {
        console.log(err);
    }
}

function* getList(action) {
    try {
        const response = yield axios.get(`/api/event/list/${action.payload}`)
        yield put({type:'SET_LIST', payload: response.data})
    } catch (err) {
        console.log(err);
    }
}

function* deletePersonInvited(action){
    try{
        yield axios.delete(`/api/event/deleteInvited/${action.payload}`);
    }catch(err){
        console.log(err);
    }
}

function* addGuest(action){
    try{
        yield axios.post('/api/event/addGuest', action.payload)
    }catch(err){
        console.log(action);
    }
}

function* addAttending(action){
    try{
        yield axios.post('/api/event/addAttending', action.payload)
    }catch(err){
        console.log(err);
    }
}
function* getAttending(action){
    try{
        const response = yield axios.get(`/api/event/getAttending/${action.payload}`)
        yield put({type: 'SET_STTENDING', payload: response.data})
    }catch(err){
        console.log(err);
    }
}

function* eventSaga() {
    yield takeEvery('ADD_EVENT', addEvent);
    yield takeEvery('GET_EVENTS', getEvents);
    yield takeEvery('GET_SINGLE_EVENT', getSingleEvent);
    yield takeEvery('UPDATE_EVENT', updateEvent);
    yield takeEvery('DELETE_EVENT', deleteEvent);
    yield takeEvery('GET_PUBLIC_EVENTS', publicEvents);
    yield takeEvery('GET_LIST', getList);
    yield takeEvery('DELETE_PERSON_INVITED', deletePersonInvited);
    yield takeEvery('ADD_GUEST', addGuest);
    yield takeEvery('ADD_ATTENDING', addAttending);
    yield takeEvery('GET_ATTENDING', getAttending);
}

export default eventSaga