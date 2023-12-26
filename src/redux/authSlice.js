import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
    name: "auth",
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: false
        },
        register: {
            isFetching: false,
            error: false,
            success: false
        },
        allusers:{
            listuser:null,
            isFetching: false,
            error: false
        },
        alllogin:{
            listlogin:null,
            isFetching: false,
            error: false
        }
    },
    reducers: {
        getallLoginStart: (state) => {
            state.alllogin.isFetching = true;
        },
        getallLoginSuccess: (state, action) => {
            state.alllogin.isFetching = false;
            state.alllogin.listlogin = action.payload;
            state.alllogin.error = false;
        },
        getallLoginFailed: (state) => {
            state.alllogin.isFetching = false;
            state.alllogin.error = true;
        },
        getallUserStart: (state) => {
            state.allusers.isFetching = true;
        },
        getallUserSuccess: (state, action) => {
            state.allusers.isFetching = false;
            state.allusers.listuser = action.payload;
            state.allusers.error = false;
        },
        getallUserFailed: (state) => {
            state.allusers.isFetching = false;
            state.allusers.error = true;
        },
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        RegisterStart: (state) => {
            state.register.isFetching = true;
        },
        RegisterSuccess: (state) => {
            state.register.isFetching = false;
            state.register.error = false;
            state.register.success = true;
        },
        RegisterFailed: (state) => {
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        },
        logoutStart: (state) => {
            state.login.isFetching = true;
        },
        logoutSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = null;
            state.login.error = false;
        },
        logoutFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
    }
})
export const {
    getallLoginStart,
    getallLoginFailed,
    getallLoginSuccess,
    getallUserStart,
    getallUserFailed,
    getallUserSuccess,
    loginStart,
    loginFailed,
    loginSuccess,
    RegisterStart,
    RegisterSuccess,
    RegisterFailed,
    logoutStart,
    logoutSuccess,
    logoutFailed
} = authSlice.actions;
export default authSlice.reducer;