import { createSlice,PayloadAction } from "@reduxjs/toolkit";

type DataSctructure = {
    dataGotten: any
}

const initialState: DataSctructure = {
    dataGotten: {}
}

const getDataSlice = createSlice({
    initialState,
    name: "data",
    reducers: {
        dataSeen: (state, action: PayloadAction) => {
            state.dataGotten = action.payload
        },

    }
}) 

export const { dataSeen } = getDataSlice.actions;
export default getDataSlice.reducer;