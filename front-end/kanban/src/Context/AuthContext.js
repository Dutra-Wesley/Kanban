import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(`${username}:${password}`),
                },
            });

            setLoading(false);

            if (response.ok) {
                const data = await response.json();
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
                setIsAuthenticated(true);
                return true;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao fazer login.');
            }
        } catch (error) {
            return false;
        }
    };

    const register = async (username, password) => {
        try {
            const response = await fetch('http://localhost:8080/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                return true;
            } else {
                throw new Error('Usuário já cadastrado!');
            }
        } catch (error) {
            alert(error.message);
            return false;
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
