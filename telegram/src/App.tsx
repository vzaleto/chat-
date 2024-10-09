import {Outlet} from "react-router-dom";

const App = () => {
    return (
        <div>
            <h2>header</h2>
            <Outlet/>
            <h2>footer</h2>
        </div>
    );
};

export default App;