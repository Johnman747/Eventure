import axios from 'axios';
import { takeEvery, put } from 'redux-saga/effects';

function* sendInvites(action){
    try{
        // yield axios.post('/api/send', action.payload);
    }catch(err){    
        console.log(err);
    }
}

function* eventSaga() {
    yield takeEvery('SEND_INVITES', sendInvites);
}

export default eventSaga