import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // User is not logged in
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // User is logged in but doesn't have required role
    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/login" replace />;
    }

    // User is authenticated and authorized
    return children;
}

export default ProtectedRoute;