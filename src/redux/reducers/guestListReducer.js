const guestListReducer = (state = [], action)=>{
    switch(action.type){
        case 'SET_LIST':
            return action.payload
        default:
            return state
    }
}

export default guestListReducer;