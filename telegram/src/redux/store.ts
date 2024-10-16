import {configureStore} from "@reduxjs/toolkit";
import chatSlice from "./chat/chatSlice.ts";
import authSlice from "./user/authSlice.ts";
import userSlice from "./user/userSlice.ts";

export const store = configureStore({
    reducer:{
        chat:chatSlice,
        auth:authSlice,
        users:userSlice
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch