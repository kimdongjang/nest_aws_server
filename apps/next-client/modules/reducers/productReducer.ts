import { createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { Product } from "../../interfaces/Product";

export interface ProductApi {
    loading: boolean;
    data: Product;
    error: AxiosError | null;
}

const initialState: ProductApi = {
    loading: false,
    data: { message:"https://images.dog.ceo/breeds/newfoundland/n02111277_7377.jpg", status:"test"},
    error: null    
}

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        // 액션에 따른 reducer 로직을 작성한다.
        // createSlice가 자동으로 state의 타입을 추론한다.
        // 또한 immer를 사용하고 있어 함수 몸체 안에서 직접 변경해도 불변성을 유지한다.
        getProducts: (state) =>{
            state.loading = true;
        },
        getProductsSuccess: (state, { payload }) => {
            state.data = payload;
            state.loading = false;
        },
        getProductsError: (state, {payload })=>{
            state.error = payload;
            state.loading = false;
        }
    }
})
// 정의한 액션과 리듀서를 export한다.
export const productsActions = productsSlice.actions;
// 아래와 같이 actions을 명시하는 것도 가능하다.
//export const {getProducts,getProductsSuccess,getProductsError } = productsSlice.actions;

// reducer의 RootState 타입을 지정
export type ProductState = ReturnType<typeof productsSlice.reducer>;

export default productsSlice;