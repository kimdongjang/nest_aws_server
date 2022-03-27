import { combineReducers } from "@reduxjs/toolkit";
import todoReducer from './reducer'
import { IState } from "./type";

export type RootState = {
    todo: IState;
}

const rootReducer = combineReducers({
    todoReducer,
})

export default rootReducer;

