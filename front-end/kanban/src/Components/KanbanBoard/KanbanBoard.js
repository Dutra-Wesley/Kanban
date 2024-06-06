import React, { useCallback, useContext, useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from '../Column/Column.js';
import AddTaskPopup from '../AddTaskPopup/AddTaskPopup.js';
import EditTaskPopup from '../EditTaskPopup/EditTaskPopup.js';
import ApiService from '../../ApiService/ApiService.js';
import AuthContext from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './KanbanBoard.css';

const KanbanBoard = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);
    const [showEditTaskPopup, setShowEditTaskPopup] = useState(false);
    const [editingTask, setEditingTask] = useState(null); // Task sendo editada
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [columns, setColumns] = useState([
        { id: 1, title: 'Iniciar', tasks: [] },
        { id: 2, title: 'Em Progresso', tasks: [] },
        { id: 3, title: 'Concluído', tasks: [] },
    ]);

    const fetchTasks = useCallback(async () => {
        if (user) {
            try {
                const data = await ApiService.getTasks(user.id);
                setTasks(data);
                const newColumns = [
                    { id: 1, title: 'Iniciar', tasks: data.filter(task => !task.startDate) },
                    { id: 2, title: 'Em Progresso', tasks: data.filter(task => task.startDate && !task.endDate) },
                    { id: 3, title: 'Concluído', tasks: data.filter(task => task.endDate) },
                ];
                setColumns(newColumns);
            } catch (error) {
                console.error('Erro ao buscar tarefas:', error);
            }
        }
    }, [user]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleAddTaskClick = () => {
        setShowAddTaskPopup(true);
    };

    const handleEditTaskClick = (task) => {
        setEditingTask(task);
        setShowEditTaskPopup(true);
    };

    const handleCloseAddTaskPopup = () => setShowAddTaskPopup(false);
    const handleCloseEditTaskPopup = () => setShowEditTaskPopup(false);

    const handleAddTask = (newTask) => {
        ApiService.addTask(newTask, user.id)
            .then(addedTask => {
                setTasks([...tasks, addedTask]); // Atualiza o estado tasks

                // Atualiza o estado columns
                setColumns(prevColumns => prevColumns.map(column => {
                    if (column.id === 1) { // Coluna "Iniciar"
                        return { ...column, tasks: [...column.tasks, addedTask] };
                    } else {
                        return column;
                    }
                }));

                handleCloseAddTaskPopup();
            });
    };

    const handleEditTask = (editedTask) => {
        ApiService.updateTask(editedTask, user.id).then(updatedTask => {
            setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
            fetchTasks();
            handleCloseEditTaskPopup();
        });
    };

    const handleDeleteTask = (taskId) => {
        ApiService.deleteTask(taskId, user.id).then(() => { // Passa o userId
            setTasks(tasks.filter(task => task.id !== taskId));
            fetchTasks();
        });
    };

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumnIndex = columns.findIndex(column => column.id === parseInt(source.droppableId));
            const destColumnIndex = columns.findIndex(column => column.id === parseInt(destination.droppableId));

            const newColumns = Array.from(columns);
            const [removed] = newColumns[sourceColumnIndex].tasks.splice(source.index, 1);

            if (sourceColumnIndex === 0 && destColumnIndex === 2 && !removed.startDate) {
                alert("Você não iniciou esta tarefa ainda!");
                fetchTasks();
                return;
            }

            newColumns[destColumnIndex].tasks.splice(destination.index, 0, removed);

            if (destColumnIndex === 1 && !removed.startDate) {
                removed.startDate = new Date().toISOString();
            } else if (destColumnIndex === 2 && !removed.endDate) {
                removed.endDate = new Date().toISOString();
            } else if (sourceColumnIndex === 1 || sourceColumnIndex === 2) {
                removed.startDate = null;
                removed.endDate = null;
            }

            setTasks(newColumns.flatMap((column) => column.tasks));
            setColumns(newColumns);

            ApiService.updateTask(removed);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <div className="kanban-board">
                <button className="logout-button" onClick={handleLogout}>
                    SAIR
                </button>
                {columns.map((column, index) => (
                    <Column
                        key={column.id}
                        column={column}
                        onAddTaskClick={handleAddTaskClick}
                        onEditTaskClick={handleEditTaskClick}
                        onDeleteTask={handleDeleteTask}
                        index={index}
                    />
                ))}
            </div>

            {showAddTaskPopup && (
                <AddTaskPopup onClose={handleCloseAddTaskPopup} onAddTask={handleAddTask} />
            )}

            {showEditTaskPopup && (
                <EditTaskPopup task={editingTask} onClose={handleCloseEditTaskPopup} onEditTask={handleEditTask} />
            )}
        </DragDropContext>
    );
};

export default KanbanBoard;
