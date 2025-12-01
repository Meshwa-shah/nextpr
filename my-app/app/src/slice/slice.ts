import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type intitial = {
    isEnabled: boolean
}
const initialState: intitial = {
    isEnabled: false
}
export const simpleSlice = createSlice({
    name: 'simple',
    initialState,
    reducers: {
        setFeature: (state, action: PayloadAction<boolean>) => {
            state.isEnabled = action.payload
        },

        changeFeature: (state) => {
            state.isEnabled = !state.isEnabled
        }
    }
})

export const { setFeature, changeFeature } = simpleSlice.actions
export default simpleSlice.reducer