const API_URL = 'http://localhost:8080/api';

const ApiService = {

    checkUsernameAvailability: (username) => fetch(`${API_URL}/users/username/availability?username=${username}`).then(res => res.json()),

    getTasks: async (userId, includeDeleted = false) => {
        try {
            const url = `${API_URL}/tasks?userId=${userId}&includeDeleted=${includeDeleted}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Erro ao buscar tarefas.');
            }

            return response.json();
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    },

    addTask: (task, userId) => fetch(`${API_URL}/tasks?userId=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    }).then(res => res.json()),

    updateTask: (task, userId) => fetch(`${API_URL}/tasks/${task.id}?userId=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    }).then(res => res.json()),

    deleteTask: (taskId, userId) => fetch(`${API_URL}/tasks/${taskId}?userId=${userId}`, { method: 'DELETE' }),

    restoreTask: async (taskId, userId) => {
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}/restore?userId=${userId}`, { method: 'PUT' });
            if (!response.ok) {
                throw new Error('Erro ao restaurar tarefa.');
            }
            return response.json();
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    },

    deleteTaskPermanently: async (taskId, userId) => {
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}/permanently?userId=${userId}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Erro ao excluir permanentemente a tarefa.');
            }
            return response;
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    },
};

export default ApiService;
