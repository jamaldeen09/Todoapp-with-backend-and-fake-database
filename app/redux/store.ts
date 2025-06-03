import { configureStore } from "@reduxjs/toolkit";
import  storageSlice from "./dataStorage"
import activatorSlice from "./modalActivator"
import  getDataSlice from "./dataGetter"

const store = configureStore({
    reducer: {
        // slices goes here
        dataStore: storageSlice,
        activator: activatorSlice,
        data: getDataSlice,
    }
})

export default store;