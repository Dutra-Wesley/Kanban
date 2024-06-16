import React, { useContext, useState, useEffect, useCallback } from 'react';
import './TrashPopup.css';
import AuthContext from '../../Context/AuthContext';
import ApiService from '../../ApiService/ApiService';
import Column from '../Column/Column.js';

const TrashPopup = ({ onClose, fetchTasks }) => {
    const { user } = useContext(AuthContext);
    const [deletedTasks, setDeletedTasks] = useState([]);
    const [sortBy, setSortBy] = useState('exclusionDate');

    const fetchDeletedTasks = useCallback(async () => {
        if (user) {
            try {
                const data = await ApiService.getTasks(user.id, true);
                setDeletedTasks(data);
            } catch (error) {
                console.error('Erro ao buscar tarefas excluídas:', error);
                setDeletedTasks([]);
            }
        }
    }, [user]);

    useEffect(() => {
        fetchDeletedTasks();
    }, [fetchDeletedTasks]);

    const sortTasks = (tasks) => {
        const sortedTasks = [...tasks];
        if (sortBy === 'name') {
            return sortedTasks.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            return sortedTasks.sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));
        }
    };

    const handleRestoreTask = (taskId) => {
        if (window.confirm('Deseja restaurar esta task?')) {
            ApiService.restoreTask(taskId, user.id).then(() => {
                fetchTasks();
                onClose();
            });
        }
    };

    const handleDeleteTaskPermanently = (taskId) => {
        if (window.confirm('Deseja excluir permanentemente esta task?')) {
            ApiService.deleteTaskPermanently(taskId, user.id).then(() => fetchDeletedTasks());
        }
    };

    const handleDeleteAllTasks = async () => {
        if (window.confirm('Tem certeza que deseja excluir todas as tasks da lixeira?')) {
            try {
                for (const task of deletedTasks) {
                    await ApiService.deleteTaskPermanently(task.id, user.id);
                }
                setDeletedTasks([]);
            } catch (error) {
                console.error('Erro ao excluir todas as tarefas:', error);
            }
        }
    };

    return (
        <div className="trash-popup">
            <h2>Lixeira</h2>
            <div className="sort-options">
                <label htmlFor="sortBy">Ordenar por:</label>
                <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="exclusionDate">Data de Exclusão</option>
                    <option value="name">Nome</option>
                </select>
            </div>
            <div className="deleted-tasks">
                {deletedTasks.length > 0 ? (
                    <Column
                        column={{
                            id: 'lixeira',
                            title: 'Lixeira',
                            tasks: sortTasks(deletedTasks)
                        }}
                        onEditTaskClick={handleRestoreTask}
                        onDeleteTask={handleDeleteTaskPermanently}
                        isTrash={true}
                    />
                ) : (
                    <p className="empty-trash-message">Lixeira Vazia</p>
                )}
            </div>
            <div className="popup-buttons">
                <button className="delete-all" onClick={handleDeleteAllTasks}>Excluir Tudo</button>
                <button className="close" onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
};

export default TrashPopup;
