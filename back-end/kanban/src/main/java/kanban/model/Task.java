package kanban.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Data
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 1)
    private String name;

    @NotBlank
    @Size(min = 1)
    private String description;

    private String startDate;
    private String endDate;
    private LocalDate creationDate;
    private Boolean deleted = false;
    private LocalDateTime deletedAt;

    @PrePersist // Anotação para definir o valor antes de persistir no banco
    protected void onCreate() {
        creationDate = LocalDate.now();
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // Relacionamento com o usuário
}
