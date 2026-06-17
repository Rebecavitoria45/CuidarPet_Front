import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, requiredRole,adminOnly  }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
        return <Navigate to="/login" replace />;
    }
    if (adminOnly && !user.admin) {
        return <Navigate to="/dashboard" replace />;
    }
    // Se a rota exige um cargo específico e o usuário não tem, manda pro dash inicial
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};