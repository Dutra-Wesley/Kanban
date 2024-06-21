import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../Context/AuthContext';
import ApiService from '../../ApiService/ApiService';
import './Register.css';

function Register() {
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [showUsernameError, setShowUsernameError] = useState(false);
    const [showPasswordError, setShowPasswordError] = useState(false);
    const [showConfirmPasswordError, setShowConfirmPasswordError] = useState(false);
    const [usernameTouched, setUsernameTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const validateUsername = async () => {
            if (username.length >= 3 && !/\s/.test(username)) {
                try {
                    const isAvailable = await ApiService.checkUsernameAvailability(username);
                    setUsernameAvailable(isAvailable);

                    if (isAvailable) {
                        setUsernameError('');
                    } else {
                        setUsernameError('Username indisponível');
                    }
                } catch (error) {
                    console.error('Erro ao verificar disponibilidade do nome de usuário:', error);
                }
            } else {
                setUsernameAvailable(null);
                setUsernameError(username.length < 3 ? 'Username deve conter ao menos 3 caracteres' : 'Username não pode conter espaços');
            }
        };

        validateUsername();
    }, [username]);

    useEffect(() => {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
        setPasswordError(
            passwordRegex.test(password) ? '' : 'Senha deve conter ao menos 6 caracteres, sendo eles:'
        );
    }, [password]);

    useEffect(() => {
        setConfirmPasswordError(password === confirmPassword ? '' : 'Senhas não coincidem');
    }, [confirmPassword, password]);

    const handleUsernameBlur = () => {
        setShowUsernameError(false);
    };

    const handlePasswordFocus = () => {
        setShowPasswordError(true);
        setPasswordTouched(true);
    };

    const handlePasswordBlur = () => {
        setShowPasswordError(false);
    };

    const handleConfirmPasswordFocus = () => {
        setShowConfirmPasswordError(true);
        setConfirmPasswordTouched(true);
    };

    const handleConfirmPasswordBlur = () => {
        setShowConfirmPasswordError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (usernameError || passwordError || confirmPasswordError) {
            return;
        }

        const success = await register(username, password);
        if (success) {
            navigate('/login');
        } else {
            alert('Erro ao cadastrar usuário.');
        }
    };

    return (
        <div className="register-container">
            <h2>Cadastro</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    {showUsernameError && (
                        <>
                            {usernameError && <p className="error-message">{usernameError}</p>}
                            {!usernameError && usernameAvailable && (
                                <p className="success-message">Username disponível</p>
                            )}
                        </>
                    )}
                    <input
                        type="text"
                        placeholder="Usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`${usernameError && usernameTouched ? 'error' : usernameAvailable ? 'success' : ''} ${username ? 'filled' : ''}`}
                        required
                        onFocus={() => { setShowUsernameError(true); setUsernameTouched(true); }}
                        onBlur={handleUsernameBlur}
                    />
                </div>
                <div className="input-group">
                    {showPasswordError && passwordError && (
                        <p className="error-message">
                            {passwordError}
                            <strong> um número, uma letra e um caractere especial</strong>
                        </p>
                    )}
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${passwordError && passwordTouched ? 'error' : ''} ${!passwordError && password ? 'valid' : ''}`}
                        required
                        onFocus={handlePasswordFocus}
                        onBlur={handlePasswordBlur}
                    />
                </div>
                <div className="input-group">
                    {showConfirmPasswordError && confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
                    <input
                        type="password"
                        placeholder="Confirmar Senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`${confirmPasswordError && confirmPasswordTouched ? 'error' : ''} ${!confirmPasswordError && confirmPassword ? 'valid' : ''}`}
                        required
                        onFocus={handleConfirmPasswordFocus}
                        onBlur={handleConfirmPasswordBlur}
                    />
                </div>
                <button type="submit" disabled={!usernameAvailable || passwordError || confirmPasswordError}>
                    Cadastrar
                </button>
            </form>
            <p>
                Já possui conta? <Link to="/login">Faça login!</Link>
            </p>
        </div>
    );
}

export default Register;
