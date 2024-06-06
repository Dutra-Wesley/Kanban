import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../../Context/AuthContext';

const PrivateRoute = () => {
    const { isAuthenticated, loading } = useContext(AuthContext); // Obtém loading do contexto

    // Verifica se ainda está carregando
    if (loading) {
        return null; // ou algum componente de carregamento
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
