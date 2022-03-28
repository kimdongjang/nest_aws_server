import { combineReducers } from "@reduxjs/toolkit";
import todoReducer from './reducer'
import { IState } from "./type";

const rootReducer = combineReducers({
    todoReducer,
})

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

