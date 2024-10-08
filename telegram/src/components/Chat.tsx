import {FormEvent, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {addMessage, setMessage} from "../redux/chat/chatSlice.ts";
import {AppDispatch, RootState} from "../redux/store.ts";

function Chat() {

    const [input, setInput] = useState('');
    const {messages} = useSelector((state: RootState) => state.chat)
    const {username} = useSelector((state: RootState) => state.auth)
    const dispatch:AppDispatch = useDispatch();
    const [ws, setWs] = useState<WebSocket | null>(null)





    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        setWs(socket)

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data)
            if (Array.isArray(data)) {
                dispatch(setMessage(data)) // data = [...] массив сообщений
            } else {
                dispatch(addMessage(data)) // data = {sender: 'User', content: 'some text'}
            }
        }
        return () => {
            socket.close()
        }
    }, [dispatch]);




    const hendleSubmit = (e:FormEvent)=>{
        e.preventDefault()
        if  (ws && input && username) {
            const message = {sender: username, content: input}
            ws.send(JSON.stringify(message))
            setInput('')
        }

    }

    return (
        <div>
            <div>
                <ul>

                    {
                        messages.length ?
                        messages.map((elem)=>(
                            <li key={elem._id}><strong> {elem.sender}</strong>: {elem.content} </li>
                        ))
                            : <p> no messages </p>
                    }

                </ul>
            </div>
            <form onSubmit={hendleSubmit} >
                <input type='text' value={input} onChange={(e) => setInput(e.target.value)}/>
                <button type='submit' >sent</button>
            </form>
        </div>
    );
}

export default Chat;