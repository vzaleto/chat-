import {FormEvent, useEffect, useState} from 'react';
import {fetchLogin} from "../redux/user/authSlice.ts";
import {AppDispatch, RootState} from "../redux/store.ts";
import {useDispatch, useSelector} from "react-redux";
import {NavLink, useNavigate} from "react-router-dom";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const {status} = useSelector((state:RootState) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (status === 'succeeded' && localStorage.getItem('authToken')) {
            navigate('/chat')
        }
    }, [status]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        dispatch(fetchLogin({username, password}))
        setUsername('')
        setPassword('')
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