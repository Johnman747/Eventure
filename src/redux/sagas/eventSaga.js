import axios from 'axios';
import { takeEvery,put } from 'redux-saga/effects';

function* addEvent(action){
    try{
        yield axios.post('/api/event/addevent', action.payload)
    }catch(err){
        console.log(err);
    }
}

function* getEvents(action){
    try{
       const response = yield axios.get(`/api/event/private/${action.payload}`)
        yield put({type: 'SET_PRIVATE_EVENTS', payload: response})
    }catch(err){
        console.log(err);
    }
}

function* eventSaga(){
    yield takeEvery('ADD_EVENT', addEvent);
    yield takeEvery('GET_EVENTS', getEvents);

}

export default eventSaga