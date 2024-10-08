import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

interface User {
    username: string,
    password: string
}

interface AuthSlice {
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    username: string | null
}

export const fetchRegister = createAsyncThunk(
    'user/fetchRegister',
    async ({username, password}: User) => {
        const response = await axios.post(`http://localhost:3000/register`, {username, password})
        return response.data
    });

export const fetchLogin = createAsyncThunk(
    'user/fetchLogin',
    async ({username, password}: User) => {
        const response = await axios.post(`http://localhost:3000/login`, {username, password})
        return response.data
    })


const initialState: AuthSlice = {
    status: 'idle',
    username: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRegister.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRegister.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(fetchRegister.rejected, (state) => {
                state.status = 'failed';
            })
            // fetchLogin
            .addCase(fetchLogin.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLogin.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.username = action.payload.username;
            })
            .addCase(fetchLogin.rejected, (state) => {
                state.status = 'failed';
            })

    }

})

export default authSlice.reducer
