import Chat from "./components/Chat.tsx";
import Register from "./components/Register.tsx";
import Login from "./components/Login.tsx";

const App = () => {
    return (
        <div>
            <Register/>
            <Login/>
            <Chat/>
        </div>
    );
};

export default App;