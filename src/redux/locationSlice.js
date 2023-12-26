import {createSlice} from "@reduxjs/toolkit";
const locationSlice = createSlice({
    name:"location",
    initialState:{
        location:{
            listlocations:null,
            isFetching:false,
            error:false
        },
        createLocation:{
            isFetching:false,
            error:false,
            success:false
        },
        editLocation:{
            isFetching:false,
            error:false,
            success:false
        },
    },
    reducers:{
        getAllLocationStart:(state)=>{
            state.location.isFetching = true;
        },
        getAllLocationSuccess:(state,action)=>{
            state.location.isFetching = false;
            state.location.listlocations = action.payload;
            state.location.error = false;
        },
        getAllLocationFailed:(state)=>{
            state.location.isFetching = false;
            state.location.error = true;
        },
        postLocationStart:(state)=>{
            state.createLocation.isFetching = true;
        },
        postLocationSuccess:(state)=>{
            state.createLocation.isFetching = false;
            state.createLocation.error = false;
            state.createLocation.success = true;
        },
        postLocationFailed:(state)=>{
            state.createLocation.isFetching = false;
            state.createLocation.error = true;
            state.createLocation.success = false;
        },
        updateLocationStart:(state)=>{
            state.editLocation.isFetching = true;
        },
        updateLocationSuccess:(state)=>{
            state.editLocation.isFetching = false;
            state.editLocation.error = false;
            state.editLocation.success = true;
        },
        updateLocationFailed:(state)=>{
            state.editLocation.isFetching = false;
            state.editLocation.error = true;
            state.editLocation.success = false;
        },
    }
})
export const {
    updateLocationStart,
    updateLocationSuccess,
    updateLocationFailed,
    postLocationStart,
    postLocationSuccess,
    postLocationFailed,
    getAllLocationStart,
    getAllLocationSuccess,
    getAllLocationFailed
} = locationSlice.actions;
export default locationSlice.reducer;