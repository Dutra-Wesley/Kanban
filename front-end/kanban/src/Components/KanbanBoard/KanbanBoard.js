import React, { useCallback, useContext, useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from '../Column/Column.js';
import AddTaskPopup from '../AddTaskPopup/AddTaskPopup.js';
import EditTaskPopup from '../EditTaskPopup/EditTaskPopup.js';
import TrashPopup from '../TrashPopup/TrashPopup.js';
import ApiService from '../../ApiService/ApiService.js';
import AuthContext from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as DeleteIcon } from '../../Imgs/Delete.svg';
import { ReactComponent as LogoutIcon } from '../../Imgs/Logout.svg';
import './KanbanBoard.css';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu.js';
import Overlay from '../Overlay/Overlay';

const KanbanBoard = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);
    const [showEditTaskPopup, setShowEditTaskPopup] = useState(false);
    const [editingTask, setEditingTask] = useState(null); // Task sendo editada
    const [showTrashPopup, setShowTrashPopup] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = useCallback(() => {
        logout();
        navigate('/login');
    }, [logout, navigate]);

    const buttons = [
        { icon: <DeleteIcon />, text: 'LIXEIRA', color: '#0068d7', onClick: () => { setShowTrashPopup(true); setIsMenuOpen(false); } },
        { icon: <LogoutIcon />, text: 'SAIR', color: '#dc3545', onClick: handleLogout },
    ];

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
                    { id: 1, title: 'Iniciar', tasks: data.filter(task => !task.startDate).sort((a, b) => a.orderIndex - b.orderIndex) },
                    { id: 2, title: 'Em Progresso', tasks: data.filter(task => task.startDate && !task.endDate).sort((a, b) => a.orderIndex - b.orderIndex) },
                    { id: 3, title: 'Concluído', tasks: data.filter(task => task.endDate).sort((a, b) => a.orderIndex - b.orderIndex) },
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
                setTasks([...tasks, addedTask]);
                const updatedColumns = [...columns];
                updatedColumns[0].tasks.push(addedTask);
                setColumns(updatedColumns);
                handleCloseAddTaskPopup();
            });
    };

    const handleEditTask = (editedTask) => {
        ApiService.updateTask(editedTask, user.id).then(updatedTask => {
            setTasks(prevTasks => prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
            fetchTasks();
            handleCloseEditTaskPopup();
        });
    };

    const handleDeleteTask = (taskId) => {
        ApiService.deleteTask(taskId, user.id).then(() => {
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

            if (sourceColumnIndex === 2 && destColumnIndex === 0) {
                alert("Você já finalizou esta tarefa, impossível iniciar novamente!");
                fetchTasks();
                return;
            }

            if (destColumnIndex === 1 && !removed.startDate) {
                removed.startDate = new Date().toISOString();
            } else if (destColumnIndex === 2 && !removed.endDate) {
                removed.endDate = new Date().toISOString();
            } else if (sourceColumnIndex === 2 && destColumnIndex === 1) {
                removed.endDate = null;
            } else if (sourceColumnIndex === 1 && destColumnIndex === 0) {
                removed.startDate = null;
                removed.endDate = null;
            }

            newColumns[destColumnIndex].tasks.splice(destination.index, 0, removed);

            newColumns[destColumnIndex].tasks.forEach((task, index) => {
                task.orderIndex = index;
            });

            setTasks(newColumns.flatMap((column) => column.tasks));
            setColumns(newColumns);

            ApiService.updateTask(removed, user.id)
                .then(() => ApiService.updateTaskOrder(newColumns[destColumnIndex].tasks, user.id))
                .catch(error => console.error('Erro ao atualizar a tarefa ou ordem:', error));
        } else {
            const columnIndex = columns.findIndex(column => column.id === parseInt(source.droppableId));
            const updatedColumn = Array.from(columns[columnIndex].tasks);
            const [removed] = updatedColumn.splice(source.index, 1);
            updatedColumn.splice(destination.index, 0, removed);

            updatedColumn.forEach((task, index) => {
                task.orderIndex = index;
            });

            setTasks(prevTasks => prevTasks.map(task => {
                if (updatedColumn.find(t => t.id === task.id)) {
                    return updatedColumn.find(t => t.id === task.id);
                } else {
                    return task;
                }
            }));
            setColumns(prevColumns => prevColumns.map(column => {
                if (column.id === parseInt(source.droppableId)) {
                    return { ...column, tasks: updatedColumn };
                } else {
                    return column;
                }
            }));

            ApiService.updateTaskOrder(updatedColumn, user.id);
        }
    };

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <div className="kanban-board">
                <HamburgerMenu buttons={buttons} isOpen={isMenuOpen} onToggle={handleMenuToggle} />
                {(showAddTaskPopup || showEditTaskPopup || showTrashPopup) && (
                    <Overlay onClick={() => {
                        setShowAddTaskPopup(false);
                        setShowEditTaskPopup(false);
                        setShowTrashPopup(false);
                    }} />
                )}
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

            {showAddTaskPopup && <AddTaskPopup onClose={handleCloseAddTaskPopup} onAddTask={handleAddTask} />}
            {showEditTaskPopup && <EditTaskPopup task={editingTask} onClose={handleCloseEditTaskPopup} onEditTask={handleEditTask} />}
            {showTrashPopup && <TrashPopup onClose={() => setShowTrashPopup(false)} fetchTasks={fetchTasks} />}
        </DragDropContext>
    );
};

export default KanbanBoard;