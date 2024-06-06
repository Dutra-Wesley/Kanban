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
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getTasks(@RequestParam("userId") Long userId) {
        List<Task> tasks = taskService.getTasksByUser(userId);
        List<TaskDTO> taskDTOs = tasks.stream()
                .map(task -> new TaskDTO(task.getId(), task.getName(), task.getDescription(), task.getCreationDate(),
                        task.getStartDate(),
                        task.getEndDate()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(taskDTOs);
    }

    @PostMapping
    public ResponseEntity<Task> addTask(@RequestBody Task task, @RequestParam("userId") Long userId) {
        Task newTask = taskService.addTask(task, userId);
        return new ResponseEntity<>(newTask, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @RequestBody Task task) {
        Task updatedTask = taskService.updateTask(id, task);
        TaskDTO taskDTO = new TaskDTO(updatedTask.getId(), updatedTask.getName(), updatedTask.getDescription(),
                task.getCreationDate(), updatedTask.getStartDate(), updatedTask.getEndDate());
        return new ResponseEntity<>(taskDTO, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
