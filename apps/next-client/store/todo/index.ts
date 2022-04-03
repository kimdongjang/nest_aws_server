import { combineReducers } from "@reduxjs/toolkit";
import todoReducer from './todoReducer'
import { IState } from "./type";

const rootReducer = combineReducers({
    todoReducer,
})

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

