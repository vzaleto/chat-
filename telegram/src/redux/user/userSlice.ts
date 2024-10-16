import axios from "axios";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk('users/fetchUsers', async () => {
    const response = await axios.get('http://localhost:3000/users')
    return response.data.users
})
interface User{
    username:string,
}
interface UserState{
    users:User[],
    status:'idle'|'loading'|'succeeded'|'failed'
}
const initialState: UserState = {
    users:[],
    status:'idle'
}

const userSlice = createSlice({
  name:'users',
  initialState,
  reducers:{},
  extraReducers:(builder)=>{
    builder
        .addCase(fetchUser.pending,(state)=>{
            state.status = 'loading';
        })
        .addCase(fetchUser.fulfilled,(state, action)=>{
            state.status = 'succeeded';
            state.users = action.payload
        })
        .addCase(fetchUser.rejected,(state)=>{
            state.status = 'failed';
        })
  }
})

export default userSlice.reducer;