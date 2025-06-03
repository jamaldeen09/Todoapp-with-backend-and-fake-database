import { createSlice,PayloadAction } from "@reduxjs/toolkit";

type StorageSchema = {
    storage: any[]
}

const initialState: StorageSchema = {
    storage: []
}

const storageSlice = createSlice({
    initialState,
    name: "dataStore",
    reducers: {
        addData: (state: any, action: PayloadAction) => {
            state.storage = action.payload
        }
    }
})

export const { addData } = storageSlice.actions;
export default storageSlice.reducer;