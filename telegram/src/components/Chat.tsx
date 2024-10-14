import { FormEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setMessage } from "../redux/chat/chatSlice.ts";
import { AppDispatch, RootState } from "../redux/store.ts";
import { useNavigate } from "react-router-dom";

function Chat() {
    const [input, setInput] = useState('');
    const { messages } = useSelector((state: RootState) => state.chat);
    const { token } = useSelector((state: RootState) => state.auth);
    const dispatch: AppDispatch = useDispatch();
    const ws = useRef<WebSocket | null>(null);
    const navigate = useNavigate();
    const [wsReady, setWsReady] = useState(false);

    // Проверка авторизации
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        if (token && !ws.current) {
            const connectWebSocket = () => {
                ws.current = new WebSocket('ws://localhost:8080');

                ws.current.onopen = () => {
                    console.log("WebSocket connection opened.");
                    setWsReady(true);
                };

                ws.current.onmessage = (e) => {
                    const data = JSON.parse(e.data);

                    // История сообщений
                    if (data.type === 'history') {
                        dispatch(setMessage(data.messages));
                    }
                    // Новое сообщение
                    else if (data.type === 'new_message') {
                        const messageExists = messages.find(msg => msg._id === data.message._id);
                        if (!messageExists) { // Проверка на существование сообщения
                            dispatch(addMessage(data.message));
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
        if (ws.current && ws.current.readyState === WebSocket.OPEN && input && wsReady && token) {
            const message = {
                token,
                content: input,
                timestamp: new Date().toISOString(),
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
    );
}

export default Chat;
