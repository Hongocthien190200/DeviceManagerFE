import {createSlice} from "@reduxjs/toolkit";
const categorySlice = createSlice({
    name:"category",
    initialState:{
        category:{
            listcategories:null,
            isFetching:false,
            error:false
        },
        createCategory:{
            isFetching:false,
            error:false,
            success:false
        },
        editCategory:{
            isFetching:false,
            error:false,
            success:false
        },
    },
    reducers:{
        getAllCategoryStart:(state)=>{
            state.category.isFetching = true;
        },
        getAllCategorySuccess:(state,action)=>{
            state.category.isFetching = false;
            state.category.listcategories = action.payload;
            state.category.error = false;
        },
        getAllCategoryFailed:(state)=>{
            state.category.isFetching = false;
            state.category.error = true;
        },
        postCategoryStart:(state)=>{
            state.createCategory.isFetching = true;
        },
        postCategorySuccess:(state)=>{
            state.createCategory.isFetching = false;
            state.createCategory.error = false;
            state.createCategory.success = true;
        },
        postCategoryFailed:(state)=>{
            state.createCategory.isFetching = false;
            state.createCategory.error = true;
            state.createCategory.success = false;
        },
        updateCategoryStart:(state)=>{
            state.editCategory.isFetching = true;
        },
        updateCategorySuccess:(state)=>{
            state.editCategory.isFetching = false;
            state.editCategory.error = false;
            state.editCategory.success = true;
        },
        updateCategoryFailed:(state)=>{
            state.editCategory.isFetching = false;
            state.editCategory.error = true;
            state.editCategory.success = false;
        },
    }
})
export const {
    updateCategoryStart,
    updateCategorySuccess,
    updateCategoryFailed,
    postCategoryStart,
    postCategorySuccess,
    postCategoryFailed,
    getAllCategoryStart,
    getAllCategorySuccess,
    getAllCategoryFailed
} = categorySlice.actions;
export default categorySlice.reducer;