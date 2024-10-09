import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {Provider} from "react-redux";
import {store} from "./redux/store";
import {StrictMode} from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Register from "./components/Register.tsx";
import Login from "./components/Login.tsx";
import Chat from "./components/Chat.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "/",
                element: <Register/>
            },
            {
                path:"/login",
                element:<Login/>
            },
            {
                path:"/chat",
                element:<Chat/>,
            }
        ]
    }
])


createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <StrictMode>
            <RouterProvider router={router}/>
        </StrictMode>
    </Provider>
)
