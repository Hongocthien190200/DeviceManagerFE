import { createSlice } from "@reduxjs/toolkit";
const rpHisSlice = createSlice({
    name: "repairHistories",
    initialState: {
        allrepair:{
            listall: null,
            isFetching: false,
            error: false
        },
        repairHis: {
            listrepairhis: null,
            isFetching: false,
            error: false
        },
        createRpHis: {
            isFetching: false,
            error: false,
            success: false
        },
        currentRpHis: {
            repairhis: null,
            isFetching: false,
            error: false
        },
        editRpHis: {
            isFetching: false,
            error: false,
            success: false
        },
    },
    reducers: {
        getAllRpStart: (state) => {
            state.allrepair.isFetching = true;
        },
        getAllRpSuccess: (state, action) => {
            state.allrepair.isFetching = false;
            state.allrepair.listall = action.payload;
            state.allrepair.error = false;
        },
        getAllRpFailed: (state) => {
            state.allrepair.isFetching = false;
            state.allrepair.error = true;
        },
        getRepairHisStart: (state) => {
            state.repairHis.isFetching = true;
        },
        getRepairHisSuccess: (state, action) => {
            state.repairHis.isFetching = false;
            state.repairHis.listrepairhis = action.payload;
            state.repairHis.error = false;
        },
        getRepairHisFailed: (state) => {
            state.repairHis.isFetching = false;
            state.repairHis.error = true;
        },
        postRpHisStart: (state) => {
            state.createRpHis.isFetching = true;
        },
        postRpHisSuccess: (state) => {
            state.createRpHis.isFetching = false;
            state.createRpHis.error = false;
            state.createRpHis.success = true;
        },
        postRpHisFailed: (state) => {
            state.createRpHis.isFetching = false;
            state.createRpHis.error = true;
            state.createRpHis.success = false;
        },
        getCurrenRpHisStart: (state) => {
            state.currentRpHis.isFetching = true;
        },
        getCurrenRpHisSuccess: (state, action) => {
            state.currentRpHis.isFetching = false;
            state.currentRpHis.repairhis = action.payload;
            state.currentRpHis.error = false;
        },
        getCurrenRpHisFailed: (state) => {
            state.currentRpHis.isFetching = false;
            state.currentRpHis.error = true;
        },
        updateRpHisStart: (state) => {
            state.editRpHis.isFetching = true;
        },
        updateRpHisSuccess: (state) => {
            state.editRpHis.isFetching = false;
            state.editRpHis.error = false;
            state.editRpHis.success = true;
        },
        updateRpHisFailed: (state) => {
            state.editRpHis.isFetching = false;
            state.editRpHis.error = true;
            state.editRpHis.success = false;
        },
    }
})
export const {
    getAllRpStart,
    getAllRpSuccess,
    getAllRpFailed,
    getRepairHisStart,
    getRepairHisSuccess,
    getRepairHisFailed,
    postRpHisStart,
    postRpHisSuccess,
    postRpHisFailed,
    getCurrenRpHisStart,
    getCurrenRpHisSuccess,
    getCurrenRpHisFailed,
    updateRpHisStart,
    updateRpHisSuccess,
    updateRpHisFailed
} = rpHisSlice.actions;
export default rpHisSlice.reducer;