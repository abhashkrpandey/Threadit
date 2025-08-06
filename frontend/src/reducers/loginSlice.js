import { createSlice } from "@reduxjs/toolkit";
const initialStateLogin = {
    userinfo: {
        username: null,
        isLoggedIn: false,
        userid: null,
        userJoinedCommunities: [],
        useravatar: null
    }
}
const initialStateCurrentActivity = {
    currentActivity: {
        SubThreaditDetails: null
    }
}

export const loginSlice = createSlice({
    name: "loginObject",
    initialState: initialStateLogin,
    reducers: {
        updateUserInfo: (state, action) => {
            const payload = action.payload;

            if (payload.username !== undefined)
                state.userinfo.username = payload.username;

            if (payload.isLoggedIn !== undefined)
                state.userinfo.isLoggedIn = payload.isLoggedIn;

            if (payload.userid !== undefined)
                state.userinfo.userid = payload.userid;

            if (payload.userJoinedCommunities !== undefined)
                state.userinfo.userJoinedCommunities = payload.userJoinedCommunities;

            if (payload.useravatar !== undefined)
                state.userinfo.useravatar = payload.useravatar;
        },
        addCommunityInArray: (state, action) => {
            state.userinfo.userJoinedCommunities.push(action.payload.value);
        },
        removeCommunityInArray: (state, action) => {
            if (action.payload.value !== undefined && state.userinfo.userJoinedCommunities !== undefined)
                state.userinfo.userJoinedCommunities = state.userinfo.userJoinedCommunities.filter((id) => (id !== (action.payload.value)))
        }
    }
})
export const currentActivitySlice = createSlice({
    name: "currentActivityObject",
    initialState: initialStateCurrentActivity,
    reducers: {
        updateCurrentActivity: (state, action) => {
            state.currentActivity.SubThreaditDetails = action.payload
        }
    }
})
export const { updateUserInfo, addCommunityInArray, removeCommunityInArray } = loginSlice.actions;
export const { updateCurrentActivity } = currentActivitySlice.actions;


export const loginReducer = loginSlice.reducer;
export const currentActivityReducer = currentActivitySlice.reducer;