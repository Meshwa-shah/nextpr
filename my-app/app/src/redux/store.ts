import { configureStore } from "@reduxjs/toolkit";
import simpleSlice from "../slice/slice";



export const store = configureStore({
  reducer: {
    slice: simpleSlice
  },
})

export type RootState = ReturnType<typeof store.getState>
export type Appdispatch = typeof store.dispatch