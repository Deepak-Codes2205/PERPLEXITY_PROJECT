import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/pages/register.jsx"
import Login from "../features/auth/pages/Login.jsx"
import Dashboard from "../features/chat/pages/Dashboard.jsx"
import Protected from "../features/auth/components/Protected.jsx"

export const router = createBrowserRouter([
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/",
        element: <Protected>
                    <Dashboard />
                </Protected>
    }
])
