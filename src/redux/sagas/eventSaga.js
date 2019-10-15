import axios from 'axios';
import { takeEvery } from 'redux-saga/effects';

function* addEvent(action){
    try{
        yield axios.post('/api/event/addevent', action.payload)
    }catch(err){
        console.log(err);
    }
}

function* eventSaga(){
    yield takeEvery('ADD_EVENT', addEvent);

}

export default eventSaga