const API_URL = 'http://localhost:8080/api';

const ApiService = {

    getTasks: async (userId) => {
        try {
            const response = await fetch(`${API_URL}/tasks?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar tarefas.');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error; // Repassa o erro para o KanbanBoard tratar
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
};

export default ApiService;
