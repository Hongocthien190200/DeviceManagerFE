import {createSlice} from "@reduxjs/toolkit";
const departmentSlice = createSlice({
    name:"department",
    initialState:{
        department:{
            listdepartments:null,
            isFetching:false,
            error:false
        },
        createDepartment:{
            isFetching:false,
            error:false,
            success:false
        },
        editDepartment:{
            isFetching:false,
            error:false,
            success:false
        },
    },
    reducers:{
        getAllDepartmentStart:(state)=>{
            state.department.isFetching = true;
        },
        getAllDepartmentSuccess:(state,action)=>{
            state.department.isFetching = false;
            state.department.listdepartments = action.payload;
            state.department.error = false;
        },
        getAllDepartmentFailed:(state)=>{
            state.department.isFetching = false;
            state.department.error = true;
        },
        postDepartmentStart:(state)=>{
            state.createDepartment.isFetching = true;
        },
        postDepartmentSuccess:(state)=>{
            state.createDepartment.isFetching = false;
            state.createDepartment.error = false;
            state.createDepartment.success = true;
        },
        postDepartmentFailed:(state)=>{
            state.createDepartment.isFetching = false;
            state.createDepartment.error = true;
            state.createDepartment.success = false;
        },
        updateDepartmentStart:(state)=>{
            state.editDepartment.isFetching = true;
        },
        updateDepartmentSuccess:(state)=>{
            state.editDepartment.isFetching = false;
            state.editDepartment.error = false;
            state.editDepartment.success = true;
        },
        updateDepartmentFailed:(state)=>{
            state.editDepartment.isFetching = false;
            state.editDepartment.error = true;
            state.editDepartment.success = false;
        },
    }
})
export const {
    updateDepartmentStart,
    updateDepartmentSuccess,
    updateDepartmentFailed,
    postDepartmentStart,
    postDepartmentSuccess,
    postDepartmentFailed,
    getAllDepartmentStart,
    getAllDepartmentSuccess,
    getAllDepartmentFailed
} = departmentSlice.actions;
export default departmentSlice.reducer;