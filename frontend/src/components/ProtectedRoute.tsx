import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/useApp";

const ProtectedRoute = () => {
    const { isAuthenticated, status } = useAppSelector((state) => state.user);

    if (status === "none" || status === "loading") {
        return null;
    }
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;