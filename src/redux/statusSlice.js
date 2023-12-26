import {createSlice} from "@reduxjs/toolkit";
const statusSlice = createSlice({
    name:"status",
    initialState:{
        status:{
            liststatuses:null,
            isFetching:false,
            error:false
        },
        createStatus:{
            isFetching:false,
            error:false,
            success:false
        },
        editStatus:{
            isFetching:false,
            error:false,
            success:false
        },
    },
    reducers:{
        getAllStatusStart:(state)=>{
            state.status.isFetching = true;
        },
        getAllStatusSuccess:(state,action)=>{
            state.status.isFetching = false;
            state.status.liststatuses = action.payload;
            state.status.error = false;
        },
        getAllStatusFailed:(state)=>{
            state.status.isFetching = false;
            state.status.error = true;
        },
        postStatusStart:(state)=>{
            state.createStatus.isFetching = true;
        },
        postStatusSuccess:(state)=>{
            state.createStatus.isFetching = false;
            state.createStatus.error = false;
            state.createStatus.success = true;
        },
        postStatusFailed:(state)=>{
            state.createStatus.isFetching = false;
            state.createStatus.error = true;
            state.createStatus.success = false;
        },
        updateStatusStart:(state)=>{
            state.editStatus.isFetching = true;
        },
        updateStatusSuccess:(state)=>{
            state.editStatus.isFetching = false;
            state.editStatus.error = false;
            state.editStatus.success = true;
        },
        updateStatusFailed:(state)=>{
            state.editStatus.isFetching = false;
            state.editStatus.error = true;
            state.editStatus.success = false;
        },
    }
})
export const {
    updateStatusStart,
    updateStatusSuccess,
    updateStatusFailed,
    postStatusStart,
    postStatusSuccess,
    postStatusFailed,
    getAllStatusStart,
    getAllStatusSuccess,
    getAllStatusFailed
} = statusSlice.actions;
export default statusSlice.reducer;