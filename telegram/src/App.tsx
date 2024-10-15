import {Outlet} from "react-router-dom";
import {AppDispatch} from "./redux/store.ts";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {autoLogin} from "./redux/user/authSlice.ts";

const App = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            dispatch(autoLogin(token))
        }
    }, [dispatch]);
    return (
        <div>
            <h2>header</h2>
            <Outlet/>
            <h2>footer</h2>
        </div>
    );
};

export default App;