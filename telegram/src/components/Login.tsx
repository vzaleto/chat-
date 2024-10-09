import {FormEvent, useState} from 'react';
import {fetchLogin} from "../redux/user/authSlice.ts";
import {AppDispatch} from "../redux/store.ts";
import {useDispatch} from "react-redux";
import {NavLink, useNavigate} from "react-router-dom";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        dispatch(fetchLogin({username, password}))
        setUsername('')
        setPassword('')
        navigate('/chat')
    }



    return (
        <form onSubmit={handleSubmit} >
            <input value={username} type='text'  onChange={(e)=>setUsername(e.target.value)} />
            <input value={password} type='text' onChange={(e)=>setPassword(e.target.value)} />
            <button type='submit' > login </button>
            <NavLink to={'/'}>Register</NavLink>

        </form>
    );
}

export default Login;