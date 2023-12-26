import {createSlice} from "@reduxjs/toolkit";
const devicesSlice = createSlice({
    name:"device",
    initialState:{
        device:{
            listdevices:null,
            isFetching:false,
            error:false
        },
        createDevice:{
            isFetching:false,
            error:false,
            success:false
        },
        deviceById:{
            currentDevice:null,
            isFetching:false,
            error:false
        },
        editDevice:{
            isFetching:false,
            error:false,
            success:false
        },
    },
    reducers:{
        getAllDeviceStart:(state)=>{
            state.device.isFetching = true;
        },
        getAllDeviceSuccess:(state,action)=>{
            state.device.isFetching = false;
            state.device.listdevices = action.payload;
            state.device.error = false;
        },
        getAllDeviceFailed:(state)=>{
            state.device.isFetching = false;
            state.device.error = true;
        },
        postDeviceStart:(state)=>{
            state.createDevice.isFetching = true;
        },
        postDeviceSuccess:(state)=>{
            state.createDevice.isFetching = false;
            state.createDevice.error = false;
            state.createDevice.success = true;
        },
        postDeviceFailed:(state)=>{
            state.createDevice.isFetching = false;
            state.createDevice.error = true;
            state.createDevice.success = false;
        },
        getDeviceByIdStart:(state)=>{
            state.deviceById.isFetching = true;
        },
        getDeviceByIdSuccess:(state,action)=>{
            state.deviceById.isFetching = false;
            state.deviceById.currentDevice = action.payload;
            state.deviceById.error = false;
        },
        getDeviceByIdFailed:(state)=>{
            state.deviceById.isFetching = false;
            state.deviceById.error = true;
        },
        updateDeviceStart:(state)=>{
            state.editDevice.isFetching = true;
        },
        updateDeviceSuccess:(state)=>{
            state.editDevice.isFetching = false;
            state.editDevice.error = false;
            state.editDevice.success = true;
        },
        updateDeviceFailed:(state)=>{
            state.editDevice.isFetching = false;
            state.editDevice.error = true;
            state.editDevice.success = false;
        },
    }
})
export const {
    getAllDeviceStart,
    getAllDeviceSuccess,
    getAllDeviceFailed,
    postDeviceStart,
    postDeviceSuccess,
    postDeviceFailed,
    getDeviceByIdStart,
    getDeviceByIdSuccess,
    getDeviceByIdFailed,
    updateDeviceStart,
    updateDeviceSuccess,
    updateDeviceFailed
} = devicesSlice.actions;
export default devicesSlice.reducer;