import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
    username: string;
    password: string;
}

interface AuthSlice {
    status: "idle" | "loading" | "succeeded" | "failed";
    username: string | null;
    token: string | null;
}

export const fetchRegister = createAsyncThunk(
    "user/fetchRegister",
    async ({ username, password }: User) => {
        const response = await axios.post("http://localhost:3000/register", { username, password });
        return response.data;
    }
);

export const fetchLogin = createAsyncThunk(
    "user/fetchLogin",
    async ({ username, password }: User) => {
        const response = await axios.post("http://localhost:3000/login", { username, password });
        return response.data;
    }
);

const initialState: AuthSlice = {
    status: "idle",
    username: null,
    token: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        autoLogin: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.status = "succeeded";
        },
        logout: (state) => {
            state.token = null;
            state.username = null;
            state.status = "idle";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRegister.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchRegister.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(fetchRegister.rejected, (state) => {
                state.status = "failed";
            })
            .addCase(fetchLogin.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchLogin.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.token = action.payload.token;
                state.username = action.payload.username;
                localStorage.setItem("authToken", action.payload.token);
            })
            .addCase(fetchLogin.rejected, (state) => {
                state.status = "failed";
            });
    },
});

export const { autoLogin, logout } = authSlice.actions;
export default authSlice.reducer;
