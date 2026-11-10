import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/useUserContext";

type ProtectedRouteProps = {
    children: React.ReactNode;
    adminOnly?: boolean;
    guestOnly?: boolean;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false, guestOnly = false }) => {
    const { user } = useUserContext()

    if (adminOnly && (!user || user.role !== "admin")) {
        return <Navigate to="/" replace />;
    }

    if (guestOnly && user) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
