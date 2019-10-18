const attendingReducer = (state=[],action)=>{
    switch(action.type){
        case 'SET_STTENDING':
            return action.payload
        default:
            return state
    }
}

export default attendingReducer;