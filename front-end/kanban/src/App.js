import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import KanbanBoard from './Components/KanbanBoard/KanbanBoard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="container">
          <Routes>
            <Route path="/login" element={
              <div className="auth-container">
                <Login />
              </div>
            } />
            <Route path="/register" element={
              <div className="auth-container">
                <Register />
              </div>
            } />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/" element={
                <div className="kanban-container">
                  <KanbanBoard />
                </div>
              } />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
