import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface Messages{
    _id?:string
    content:string,
    sender:string,

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
        addMessage:(state, action: PayloadAction<Messages>) => {
            state.messages.push(action.payload)
        },
        setMessage: (state, action: PayloadAction<Messages[]>) => {
            state.messages = action.payload
        }
    }
})
export default chatSlice.reducer
export const {addMessage, setMessage} = chatSlice.actions