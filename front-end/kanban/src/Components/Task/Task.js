import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import AddTaskButton from '../AddTaskButton/AddTaskButton.js';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import './Task.css';

const Task = ({ task, index, onEditTaskClick, onDeleteTask, isTrash = false }) => {
    const handleDeleteClick = () => {
        if (task.deleted) {
            onDeleteTask(task.id);
        } else {
            if (window.confirm(`Deseja realmente excluir a tarefa "${task.name}"?`)) {
                onDeleteTask(task.id);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return format(date, 'dd/MM/yyyy HH:mm');
    };

    const formatDateStart = (dateString) => {
        if (!dateString) return '';
        const date = toZonedTime(dateString, 'America/Sao_Paulo');
        return format(date, 'dd/MM/yyyy');
    };

    return (
        <Draggable draggableId={task.id.toString()} index={index} isDragDisabled={isTrash}>
            {(provided) => (
                <div
                    className={`task ${isTrash ? 'trash' : ''}`}
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
                        {isTrash ? (
                            <AddTaskButton size="small" iconName="restore" onClick={() => onEditTaskClick(task.id)} />
                        ) : (
                            <AddTaskButton size="small" iconName="edit" onClick={() => onEditTaskClick(task)} />
                        )}
                        <AddTaskButton size="small" iconName="delete" onClick={handleDeleteClick} />
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default Task;
