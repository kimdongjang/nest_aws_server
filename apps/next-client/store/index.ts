import { createStore, applyMiddleware, Middleware, StoreEnhancer, Store, combineReducers, AnyAction } from "redux"
import todoReducer from "./todo/todoReducer";
import { MakeStore, createWrapper, Context, HYDRATE } from "next-redux-wrapper";
import { IState } from "./todo/type";
import thunkMiddleware from 'redux-thunk'
import { Reducer } from "typesafe-actions";
import { composeWithDevTools } from "@reduxjs/toolkit/dist/devtoolsExtension";

export interface AppState {
    todo: IState
}

const combinedReducers = combineReducers({ todo: todoReducer })

const reducer: Reducer<AppState, AnyAction> = (state, action) => {
    if (action.type === HYDRATE) {
        /* client state will be overwritten
         * by server or static state hydation.
         * Implement state preservation as needed.
         * see: https://github.com/kirill-konshin/next-redux-wrapper#server-and-client-state-separation
         */
        return {
            ...state,
            ...action.payload,
        }
    }
    return combinedReducers(state, action)
}


const initStore: MakeStore<Store<AppState>> = () => {
    return createStore(
        reducer,
        composeWithDevTools(applyMiddleware(thunkMiddleware))
    )
}

export const storeWrapper = createWrapper<Store<AppState>>(initStore)