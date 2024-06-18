package kanban.controller;

import kanban.dto.TaskDTO;
import kanban.model.Task;
import kanban.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // Configuração do CORS
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getTasks(@RequestParam("userId") Long userId,
            @RequestParam(value = "includeDeleted", defaultValue = "false") boolean includeDeleted) {
        List<Task> tasks = taskService.getTasksByUser(userId, includeDeleted);
        List<TaskDTO> taskDTOs = tasks.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(taskDTOs);
    }

    @PostMapping
    public ResponseEntity<TaskDTO> addTask(@RequestBody Task task, @RequestParam("userId") Long userId) {
        Task newTask = taskService.addTask(task, userId);
        return new ResponseEntity<>(convertToDTO(newTask), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @RequestBody Task task) {
        Task updatedTask = taskService.updateTask(id, task);
        return new ResponseEntity<>(convertToDTO(updatedTask), HttpStatus.OK);
    }

    @PutMapping("/{id}/restore")
    public ResponseEntity<TaskDTO> restoreTask(@PathVariable Long id) {
        Task restoredTask = taskService.restoreTask(id);
        return ResponseEntity.ok(convertToDTO(restoredTask));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/permanently")
    public ResponseEntity<Void> deleteTaskPermanently(@PathVariable Long id) {
        taskService.deleteTaskPermanently(id);
        return ResponseEntity.noContent().build();
    }

    // Método auxiliar para converter Task para TaskDTO
    private TaskDTO convertToDTO(Task task) {
        return new TaskDTO(task.getId(), task.getName(), task.getDescription(),
                task.getStartDate(), task.getEndDate(), task.getCreationDate(), task.getDeleted(), task.getDeletedAt());
    }
}
