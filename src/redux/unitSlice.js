import {createSlice} from "@reduxjs/toolkit";
const unitSlice = createSlice({
    name:"unit",
    initialState:{
        unit:{
            listunits:null,
            isFetching:false,
            error:false
        },
        createUnit:{
            isFetching:false,
            error:false,
            success:false
        },
        editUnit:{
            isFetching:false,
            error:false,
            success:false
        },
    },
    reducers:{
        getAllUnitStart:(state)=>{
            state.unit.isFetching = true;
        },
        getAllUnitSuccess:(state,action)=>{
            state.unit.isFetching = false;
            state.unit.listunits = action.payload;
            state.unit.error = false;
        },
        getAllUnitFailed:(state)=>{
            state.unit.isFetching = false;
            state.unit.error = true;
        },
        postUnitStart:(state)=>{
            state.createUnit.isFetching = true;
        },
        postUnitSuccess:(state)=>{
            state.createUnit.isFetching = false;
            state.createUnit.error = false;
            state.createUnit.success = true;
        },
        postUnitFailed:(state)=>{
            state.createUnit.isFetching = false;
            state.createUnit.error = true;
            state.createUnit.success = false;
        },
        updateUnitStart:(state)=>{
            state.editUnit.isFetching = true;
        },
        updateUnitSuccess:(state)=>{
            state.editUnit.isFetching = false;
            state.editUnit.error = false;
            state.editUnit.success = true;
        },
        updateUnitFailed:(state)=>{
            state.editUnit.isFetching = false;
            state.editUnit.error = true;
            state.editUnit.success = false;
        },
    }
})
export const {
    updateUnitStart,
    updateUnitSuccess,
    updateUnitFailed,
    postUnitStart,
    postUnitSuccess,
    postUnitFailed,
    getAllUnitStart,
    getAllUnitSuccess,
    getAllUnitFailed
} = unitSlice.actions;
export default unitSlice.reducer;