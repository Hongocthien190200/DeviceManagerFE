import { createSlice } from "@reduxjs/toolkit";
const mnHisSlice = createSlice({
    name: "maintenance",
    initialState: {
        allmaintenance:{
            listall: null,
            isFetching: false,
            error: false
        },
        maintenances: {
            listmaintenances: null,
            isFetching: false,
            error: false
        },
        createMnHis: {
            isFetching: false,
            error: false,
            success: false
        },
        currentMnHis: {
            maintenance: null,
            isFetching: false,
            error: false
        },
        editMnHis: {
            isFetching: false,
            error: false,
            success: false
        },
    },
    reducers: {
        getAllMnStart: (state) => {
            state.allmaintenance.isFetching = true;
        },
        getAllMnSuccess: (state, action) => {
            state.allmaintenance.isFetching = false;
            state.allmaintenance.listall = action.payload;
            state.allmaintenance.error = false;
        },
        getAllMnFailed: (state) => {
            state.allmaintenance.isFetching = false;
            state.allmaintenance.error = true;
        },
        getMaintenanceStart: (state) => {
            state.maintenances.isFetching = true;
        },
        getMaintenanceSuccess: (state, action) => {
            state.maintenances.isFetching = false;
            state.maintenances.listmaintenances = action.payload;
            state.maintenances.error = false;
        },
        getMaintenanceFailed: (state) => {
            state.maintenances.isFetching = false;
            state.maintenances.error = true;
        },
        postMnHisStart: (state) => {
            state.createMnHis.isFetching = true;
        },
        postMnHisSuccess: (state) => {
            state.createMnHis.isFetching = false;
            state.createMnHis.error = false;
            state.createMnHis.success = true;
        },
        postMnHisFailed: (state) => {
            state.createMnHis.isFetching = false;
            state.createMnHis.error = true;
            state.createMnHis.success = false;
        },
        getCurrenMnHisStart: (state) => {
            state.currentMnHis.isFetching = true;
        },
        getCurrenMnHisSuccess: (state, action) => {
            state.currentMnHis.isFetching = false;
            state.currentMnHis.maintenance = action.payload;
            state.currentMnHis.error = false;
        },
        getCurrenMnHisFailed: (state) => {
            state.currentMnHis.isFetching = false;
            state.currentMnHis.error = true;
        },
        updateMnHisStart: (state) => {
            state.editMnHis.isFetching = true;
        },
        updateMnHisSuccess: (state) => {
            state.editMnHis.isFetching = false;
            state.editMnHis.error = false;
            state.editMnHis.success = true;
        },
        updateMnHisFailed: (state) => {
            state.editMnHis.isFetching = false;
            state.editMnHis.error = true;
            state.editMnHis.success = false;
        },
    }
})
export const {
    getAllMnStart,
    getAllMnSuccess,
    getAllMnFailed,
    getMaintenanceStart,
    getMaintenanceSuccess,
    getMaintenanceFailed,
    postMnHisStart,
    postMnHisSuccess,
    postMnHisFailed,
    getCurrenMnHisStart,
    getCurrenMnHisSuccess,
    getCurrenMnHisFailed,
    updateMnHisStart,
    updateMnHisSuccess,
    updateMnHisFailed
} = mnHisSlice.actions;
export default mnHisSlice.reducer;