import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('adminToken');
    let adminUser = null;
    try {
        const raw = localStorage.getItem('adminUser');
        adminUser = raw ? JSON.parse(raw) : null;
    } catch {
        adminUser = null;
    }
    if (!token || !(adminUser && adminUser.role === 'admin')) {
        return <Navigate to="/admin" replace />;
    }
    return <>{children}</>;
};

export default AdminProtectedRoute;
