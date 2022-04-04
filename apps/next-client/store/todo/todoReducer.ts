import { createReducer } from "typesafe-actions";
import { ADD_TODO, DELETE_TODO } from "./todoActions";
import { IState, IStateAction } from "./type";
import { HYDRATE } from "next-redux-wrapper";
import produce from 'immer';
import { AnyAction } from "redux";


const initialState: IState = { value: [] };

const todoReducer = (
    state: IState = { value: [] },
    action: AnyAction
) => {
    switch (action.type) {
        case HYDRATE:
            // if (action.payload.app === "init") delete action.payload.app;
            // if (action.payload.page === "init") delete action.payload.page;
            return { ...state, ...action.payload };
        case ADD_TODO:
            return { ...state, state: state.value.push(action.payload) };
        case DELETE_TODO:
            return { ...state, page: action.payload };
        default:
            return state;
    }
};

// const todoReducer = createReducer<IState, IStateAction>(initialState, {
//     [HYDRATE]: (state, action) =>
//         produce(state, draft => {


//         }),
//     [ADD_TODO]: (state, action) =>
//         produce(state, draft => {
//             state.value.push(action.payload.value)
//             // draft.value += 1
//         }),
//     [DELETE_TODO]: (state, action) =>
//         produce(state, draft => {
//             // draft.value -= 1
//         })
// });

export default todoReducer;