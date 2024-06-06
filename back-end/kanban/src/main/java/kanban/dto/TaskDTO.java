package kanban.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class TaskDTO {

    private Long id;
    private String name;
    private String description;
    private LocalDate creationDate;
    private String startDate;
    private String endDate;

    public TaskDTO(Long id, String name, String description, LocalDate creationDate, String startDate, String endDate) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.creationDate = creationDate;
        this.startDate = startDate;
        this.endDate = endDate;
    }

}
