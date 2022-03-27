import { combineReducers } from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper"

import counter from "./counter";
import { IState } from './type';

const reducer = (state:IState, action:) => {
    if(action.type === HYDRATE){
        return{
            ...state,
            ...action.payload
        };
    }
    return combineReducers({
        counter,
    })(state,action);
}
export default reducer;