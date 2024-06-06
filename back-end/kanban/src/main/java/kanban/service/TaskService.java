package kanban.service;

import kanban.exceptions.UserNotFoundException;
import kanban.model.Task;
import kanban.model.User;
import kanban.repository.TaskRepository;
import kanban.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Task> getTasksByUser(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new UserNotFoundException("Usuário não encontrado");
        }
        return taskRepository.findByUser(userOptional.get());
    }

    public Task addTask(Task task, Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new UserNotFoundException("Usuário não encontrado");
        }
        task.setUser(userOptional.get());
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task updatedTask) {
        Optional<Task> existingTask = taskRepository.findById(id);
        if (existingTask.isPresent()) {
            Task task = existingTask.get();
            task.setName(updatedTask.getName());
            task.setDescription(updatedTask.getDescription());
            task.setStartDate(updatedTask.getStartDate());
            task.setEndDate(updatedTask.getEndDate());
            return taskRepository.save(task);
        } else {
            throw new RuntimeException("Tarefa não encontrada com o ID: " + id);
        }
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}