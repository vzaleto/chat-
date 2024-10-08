import {FormEvent, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import {AppDispatch, RootState} from "../redux/store.ts";
import {fetchRegister} from "../redux/user/authSlice.ts";

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { status } = useSelector((state:RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    console.log(status);

    // const navigate = useNavigate();

    const hendleSubmit = (e:FormEvent)=>{
        e.preventDefault();
      dispatch(fetchRegister({username, password}))
    }

    useEffect(() => {

        if(status === 'succeeded'){
            console.log('privet')
        }

    }, [status]);

    return (
        <form onSubmit={hendleSubmit} >
            <input type='text' value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input type='text' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type='submit' >registet</button>
        </form>
    );
}

export default Register;
