import {configureStore} from "@reduxjs/toolkit";
import {loginReducer,currentActivityReducer} from "../reducers/loginSlice";

export const store =configureStore({
    reducer:{
        login:loginReducer,
        activity:currentActivityReducer}
});
