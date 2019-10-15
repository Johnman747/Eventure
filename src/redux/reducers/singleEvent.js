const singelEventReducer = (state = [], action)=>{
    switch(action.type){
        case 'SET_SINGLE_EVENT':
            return action.payload 
        default:
            return state
    }
}

export default singelEventReducer;
