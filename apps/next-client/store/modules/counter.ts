import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IState {
  value: number;
}

// or

type TState = {
  value: number;
};

const initialState: IState = { value: 0 };

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state, action: PayloadAction<{ value: number }>) => {
      state.value = action.payload.value;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = counterSlice.actions; // 액션 생성함수
export default counterSlice.reducer; // 리듀서
