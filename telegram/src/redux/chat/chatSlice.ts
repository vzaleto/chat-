import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface Messages{
    _id?:string
    content:string,
    sender:string,
    timestamp: Date
}

interface ChatState{
    messages:Messages[]
}

const initialState:ChatState={
    messages:[]
}

const chatSlice = createSlice({
    name:'chat',
    initialState,
    reducers:{
        setMessage: (state, action: PayloadAction<Messages[]>) => {
            state.messages = action.payload
        },
        addMessage: (state, action: PayloadAction<Messages>) => {
            state.messages.push(action.payload)
        }
    }
})
export default chatSlice.reducer
export const {setMessage, addMessage} = chatSlice.actions