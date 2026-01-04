import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If user role is not authorized (e.g. Viewer trying to upload)
        // Redirect to dashboard or unauthorized page
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
