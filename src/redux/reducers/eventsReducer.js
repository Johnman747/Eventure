const eventReducer = (state = [], action)=>{
    switch(action.type){
        case 'SET_PRIVATE_EVENTS':
            return action.payload.data
        default:
            return state
    }
}

export default eventReducer;
