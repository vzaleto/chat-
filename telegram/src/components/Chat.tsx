import { FormEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setMessage } from "../redux/chat/chatSlice.ts";
import { AppDispatch, RootState } from "../redux/store.ts";
import { useNavigate } from "react-router-dom";
import {fetchUser} from "../redux/user/userSlice.ts";

function Chat() {
    const [input, setInput] = useState('');
    const [recipient, setRecipient] = useState('');
    const { messages } = useSelector((state: RootState) => state.chat);
    const { token } = useSelector((state: RootState) => state.auth);
    const dispatch: AppDispatch = useDispatch();
    const ws = useRef<WebSocket | null>(null);
    const navigate = useNavigate();
    const [wsReady, setWsReady] = useState(false);
    const {users} = useSelector((state: RootState)=> state.users)

    // Проверка авторизации
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        dispatch(fetchUser())
        console.log(users)
        console.log('messages 29', messages)
        console.log(typeof  ws.current)
    }, [dispatch]);

    useEffect(() => {
        if (token && !ws.current) {
            console.log(1)
            const connectWebSocket = () => {

                ws.current = new WebSocket('ws://localhost:8080');

                ws.current.onopen = () => {
                    console.log("WebSocket connection opened.");
                    setWsReady(true); // ?  это нада?
                };

                ws.current.onmessage = (e) => {
                    const data = JSON.parse(e.data);

                    console.log('data', data)

                    // История сообщений
                    if (data.type === 'history') {
                        console.log('data history', data.messages)
                        dispatch(setMessage(data.messages));
                    }
                    // Новое сообщение
                    else if (data.type === 'new_message') {
                        console.log('messages data.type', messages)
                        const messageExists = messages.find(msg => msg._id === data.message._id);
                        if (!messageExists) { // Проверка на существование сообщения

                            dispatch(addMessage(data.message)); // новое объект
                            console.log('New message:', data.message);
                        }
                    }
                };

                ws.current.onerror = (error) => {
                    console.error('WebSocket error:', error);
                };

                ws.current.onclose = () => {
                    console.log('WebSocket connection closed, retrying...');
                    setWsReady(false);
                    setTimeout(connectWebSocket, 1000);


                };
            };

            connectWebSocket();

            return () => {
                if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                    ws.current.close();
                }
            };
        }
    }, [dispatch, token, messages]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (ws.current && ws.current.readyState === WebSocket.OPEN && input && wsReady && token && recipient) {
            const message = {
                token,
                content: input,
                receiver: recipient,
                timestamp: new Date().toISOString(),
                type: 'message'
            };
            console.log('Sending message:', message);
            ws.current.send(JSON.stringify(message));
            setInput('')
        } else {
            console.error('WebSocket is not ready, input is empty, or token is missing.');
        }
    };

    return (

        <div>
            <div>
                <select value={recipient} onChange={(e) => setRecipient(e.target.value)}>

                    {
                        users.length > 0 ? (
                            users.map((elem)=>(
                                <option key={elem.username} value={elem.username} >
                                    {elem.username}
                                </option>
                            ))
                        ): (
                            <option disabled>No users</option>
                        )}

                </select>
            </div>


        <div>
            <div>
                <ul>
                    {messages.length ? (
                        messages.map((elem) => (
                            <li key={elem._id}>
                                <strong>{elem.sender}</strong>: {elem.content || 'No content'}
                            </li>
                        ))
                    ) : (
                        <p>No messages</p>
                    )}
                </ul>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </div>
        </div>
    );
}

export default Chat;
