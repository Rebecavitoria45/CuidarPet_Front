import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    // Se não houver token, redireciona para o login
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};