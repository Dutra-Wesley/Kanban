import React, { useState, useEffect } from 'react';
import './EditTaskPopup.css';

const EditTaskPopup = ({ task, onClose, onEditTask }) => {
    const [taskName, setTaskName] = useState(task.name);
    const [taskDescription, setTaskDescription] = useState(task.description);

    useEffect(() => {
        setTaskName(task.name);
        setTaskDescription(task.description);
    }, [task]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!taskName.trim() || !taskDescription.trim()) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const editedTask = {
            ...task,
            name: taskName,
            description: taskDescription,
        };

        onEditTask(editedTask);
        onClose();
    };

    return (
        <div className="edit-task-popup">
            <form onSubmit={handleSubmit}>
                <h2>Editar Tarefa</h2>
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
                    <button type="submit">Salvar</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default EditTaskPopup;
