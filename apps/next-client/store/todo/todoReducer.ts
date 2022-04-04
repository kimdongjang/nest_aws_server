import { createReducer } from "typesafe-actions";
import { ADD_TODO, DELETE_TODO } from "./todoActions";
import { IState, IStateAction } from "./type";
import produce from 'immer';


const initialState: IState = { value: [] };

const todoReducer = createReducer<IState, IStateAction>(initialState, {
    [ADD_TODO]: (state, action) =>
        produce(state, draft => {
            state.value.push(action.payload.value)
            // draft.value += 1
        }),
    [DELETE_TODO]: (state, action) =>
        produce(state, draft => {
            // draft.value -= 1
        })
});

export default todoReducer;