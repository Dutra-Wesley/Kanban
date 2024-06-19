package kanban.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskDTO {

    private Long id;
    private Integer orderIndex;
    private String name;
    private String description;
    private String startDate;
    private String endDate;
    private LocalDate creationDate;
    private Boolean deleted;
    private LocalDateTime deletedAt;

}
