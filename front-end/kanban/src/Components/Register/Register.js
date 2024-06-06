import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../Context/AuthContext';
import './Register.css';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            setPassword(''); // Limpa o campo de senha
            setConfirmPassword(''); // Limpa o campo de confirmar senha
            return;
        }

        const success = await register(username, password);
        if (success) {
            navigate('/login');
        } else {
            setUsername(''); // Limpa o campo de username
            setPassword(''); // Limpa o campo de senha
            setConfirmPassword(''); // Limpa o campo de confirmar senha
        }
    };

    return (
        <div className="register-container">
            <h2>Cadastro</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirmar Senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Cadastrar</button>
            </form>
            <p>
                Já possui conta? <Link to="/login">Faça login!</Link>
            </p>
        </div>
    );
}

export default Register;
