import React, { useState } from 'react';
import './AddTaskPopup.css';

const AddTaskPopup = ({ onClose, onAddTask }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!taskName.trim() || !taskDescription.trim()) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const newTask = {
            name: taskName,
            description: taskDescription,
        };

        onAddTask(newTask);
        setTaskName('');
        setTaskDescription('');
        onClose();
    };

    return (
        <div className="popup">
            <form onSubmit={handleSubmit}>
                <h2>Adicionar Tarefa</h2>
                <div>
                    <label htmlFor="taskName">Nome:</label>
                    <input
                        type="text"
                        id="taskName"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="taskDescription">Descrição:</label>
                    <textarea
                        id="taskDescription"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="button-container">
                    <button type="submit">Adicionar</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default AddTaskPopup;
