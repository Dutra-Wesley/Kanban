import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from '../Task/Task.js';
import AddTaskButton from '../AddTaskButton/AddTaskButton.js';
import './Column.css';

const Column = ({ column, onAddTaskClick, onEditTaskClick, onDeleteTask }) => {
    const isStartColumn = column.title === 'Iniciar';
  const isProgressColumn = column.title === 'Em Progresso';
  const isDoneColumn = column.title === 'Concluído';

    return (
        <div className="column-wrapper">
            <div className={`column-header ${isStartColumn ? 'start' : isProgressColumn ? 'progress' : isDoneColumn ? 'done' : ''}`}>
                <h2>{column.title}</h2>
            </div>
            <Droppable droppableId={column.id.toString()} type="task">
                {(provided) => (
                    <div className={`column ${isStartColumn ? 'start' : ''}`} {...provided.droppableProps} ref={provided.innerRef}>
                        <div className="tasks-container">
                            {column.tasks.map((task, index) => ( // Certifique-se de que column.tasks é um array
                                <Task
                                    key={task.id}
                                    task={task}
                                    index={index}
                                    onEditTaskClick={onEditTaskClick}
                                    onDeleteTask={onDeleteTask}
                                />
                            ))}
                            {provided.placeholder}
                            {isStartColumn && (
                                <AddTaskButton size="large" iconName="add" onClick={onAddTaskClick} />
                            )}
                        </div>
                    </div>
                )}
            </Droppable>
        </div>

    );
};

export default Column;
