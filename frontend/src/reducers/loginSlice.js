import { createSlice } from "@reduxjs/toolkit";
const initialStateLogin = {
    userinfo: {
        username: null,
        isLoggedIn: false,
        userid:null
    }
}
const initialStateCurrentActivity = { 
   currentActivity:{
        SubThreaditDetails:null
    }
}

export const loginSlice = createSlice({
    name: "loginObject",
    initialState:initialStateLogin,
    reducers: {
        updateUserInfo:  (state, action) => {
            state.userinfo.username=action.payload.username,
            state.userinfo.isLoggedIn=action.payload.isLoggedIn
            state.userinfo.userid=action.payload.userid
        }
    }
})
export const currentActivitySlice= createSlice({
    name:"currentActivityObject",
    initialState:initialStateCurrentActivity,
    reducers:{
        updateCurrentActivity:(state,action)=>
        {
            state.currentActivity.SubThreaditDetails=action.payload
        }
    }
})
export const {updateUserInfo} =loginSlice.actions; 
export const {updateCurrentActivity} =currentActivitySlice.actions; 


export const  loginReducer= loginSlice.reducer;
export const currentActivityReducer=currentActivitySlice.reducer;