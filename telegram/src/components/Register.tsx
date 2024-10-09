import {FormEvent, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import {AppDispatch, RootState} from "../redux/store.ts";
import {fetchRegister} from "../redux/user/authSlice.ts";
import {NavLink, useNavigate} from "react-router-dom";

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { status } = useSelector((state:RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    console.log(status);

    // const navigate = useNavigate();

    const hendleSubmit = (e:FormEvent)=>{
        e.preventDefault();
      dispatch(fetchRegister({username, password}))

    }

    useEffect(() => {

        if(status === 'succeeded'){
            console.log('privet')
            navigate('/login')
        }

    }, [status]);

    return (
        <form onSubmit={hendleSubmit} >
            <input type='text' value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input type='text' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type='submit' >registet</button>
            <NavLink to={'/login'} >Login</NavLink>
        </form>
    );
}

export default Register;
