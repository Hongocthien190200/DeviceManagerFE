import {createSlice} from "@reduxjs/toolkit";
const homeSlice = createSlice({
    name:"home",
    initialState:{
        count:{
            quantity:null,
            isFetching:false,
            error:false
        }
    },
    reducers:{
        countStart:(state)=>{
            state.count.isFetching = true;
        },
        countSuccess:(state,action)=>{
            state.count.isFetching = false;
            state.count.quantity = action.payload;
            state.count.error = false;
        },
        countFailed:(state)=>{
            state.count.isFetching = false;
            state.count.error = true;
        },
    }
})
export const {
    countStart,
    countSuccess,
    countFailed
} = homeSlice.actions;
export default homeSlice.reducer;