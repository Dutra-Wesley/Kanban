import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import AddTaskButton from '../AddTaskButton/AddTaskButton.js';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import './Task.css';

const Task = ({ task, index, onEditTaskClick, onDeleteTask }) => {
    const handleDeleteClick = () => {
        if (window.confirm(`Deseja realmente excluir a tarefa "${task.name}"?`)) {
            onDeleteTask(task.id);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return format(date, 'dd/MM/yyyy HH:mm');
    };

    const formatDateStart = (dateString) => {
        if (!dateString) return '';
        const date = toZonedTime(dateString, 'America/Sao_Paulo'); // Ajuste para seu fuso horário
        return format(date, 'dd/MM/yyyy');
    };

    return (
        <Draggable draggableId={task.id.toString()} index={index}>
            {(provided) => (
                <div
                    className="task"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <h3>{task.name}</h3>
                    <p>{task.description}</p>
                    {task.creationDate && (
                        <p>Criado em: {formatDateStart(task.creationDate)}</p>
                    )}
                    {task.startDate && (
                        <p>Início: {formatDate(task.startDate)}</p>
                    )}
                    {task.endDate && (
                        <p>Fim: {formatDate(task.endDate)}</p>
                    )}
                    <div className="task-buttons">
                        <AddTaskButton size="small" iconName="edit" onClick={() => onEditTaskClick(task)} />
                        <AddTaskButton size="small" iconName="delete" onClick={handleDeleteClick} />
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default Task;
