import { configureStore } from "@reduxjs/toolkit";
import  storageSlice from "./dataStorage"

const store = configureStore({
    reducer: {
        // slices goes here
        dataStore: storageSlice
    }
})

export default store;