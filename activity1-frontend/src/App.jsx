import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ServiceRequests from "./ServiceRequests";

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/login" />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/requests"
                    element={<ServiceRequests />}
                />
            </Routes>
        </>
    );
}

export default App;