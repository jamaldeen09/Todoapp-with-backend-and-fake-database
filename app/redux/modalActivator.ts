import { createSlice } from "@reduxjs/toolkit";

type ActivatorSchema = {
    modalActivator: boolean
}

const initialState: ActivatorSchema = {
    modalActivator: false
}

const activatorSlice = createSlice({
    initialState,
    name: "activator",
    reducers: {
        activateModal: (state) => {
            state.modalActivator = true
        },
        deactivateModal: (state) => {
            state.modalActivator = false
        }
    }
})

export const { activateModal,deactivateModal } = activatorSlice.actions;
export default activatorSlice.reducer;