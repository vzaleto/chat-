import {configureStore} from "@reduxjs/toolkit";
import chatSlice from "./chat/chatSlice.ts";
import authSlice from "./user/authSlice.ts";

export const store = configureStore({
    reducer:{
        chat:chatSlice,
        auth:authSlice
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch