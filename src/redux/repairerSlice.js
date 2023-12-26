import { createSlice } from "@reduxjs/toolkit";
const repairerSlice = createSlice({
    name: "repairer",
    initialState: {
        repairer: {
            listrepairers: null,
            isFetching: false,
            error: false
        },
        createRepairer: {
            isFetching: false,
            error: false,
            success: false
        },
        editRepairer: {
            isFetching: false,
            error: false,
            success: false
        },
    },
    reducers: {
        getAllRepairerStart: (state) => {
            state.repairer.isFetching = true;
        },
        getAllRepairerSuccess: (state, action) => {
            state.repairer.isFetching = false;
            state.repairer.listrepairers = action.payload;
            state.repairer.error = false;
        },
        getAllRepairerFailed: (state) => {
            state.repairer.isFetching = false;
            state.repairer.error = true;
        },
        postRepairerStart: (state) => {
            state.createRepairer.isFetching = true;
        },
        postRepairerSuccess: (state) => {
            state.createRepairer.isFetching = false;
            state.createRepairer.error = false;
            state.createRepairer.success = true;
        },
        postRepairerFailed: (state) => {
            state.createRepairer.isFetching = false;
            state.createRepairer.error = true;
            state.createRepairer.success = false;
        },
        updateRepairerStart: (state) => {
            state.editRepairer.isFetching = true;
        },
        updateRepairerSuccess: (state) => {
            state.editRepairer.isFetching = false;
            state.editRepairer.error = false;
            state.editRepairer.success = true;
        },
        updateRepairerFailed: (state) => {
            state.editRepairer.isFetching = false;
            state.editRepairer.error = true;
            state.editRepairer.success = false;
        },
    }
})
export const {
    updateRepairerStart,
    updateRepairerSuccess,
    updateRepairerFailed,
    postRepairerStart,
    postRepairerSuccess,
    postRepairerFailed,
    getAllRepairerStart,
    getAllRepairerSuccess,
    getAllRepairerFailed
} = repairerSlice.actions;
export default repairerSlice.reducer;