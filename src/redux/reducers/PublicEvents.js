const publicEventsReducer = (state = [], action)=>{
    switch(action.type){
        case 'SET_PUBLIC_EVENTS':
            return action.payload
        default:
            return state
    }
}

export default publicEventsReducer;
