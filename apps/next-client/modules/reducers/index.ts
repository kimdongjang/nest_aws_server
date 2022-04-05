import { combineReducers } from "redux";
import productsSlice from "./productReducer";

const rootReducer = combineReducers(productsSlice.reducer);

export default rootReducer;