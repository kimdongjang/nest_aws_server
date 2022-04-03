import { createReducer } from "typesafe-actions";
import { ADD_TODO, DELETE_TODO } from "./todoActions";
import { IState, IStateAction } from "./type";
import produce from 'immer';


const initialState: IState = { value: [] };

const todoReducer = createReducer<IState, IStateAction>(initialState, {
    [ADD_TODO]: (state, action) =>
        produce(state, draft => {
            draft.value.push(action.payload.value)
        }),
    [DELETE_TODO]: (state, action) =>
        produce(state, draft => {
            draft.value.pop();
        })
});

export default todoReducer;