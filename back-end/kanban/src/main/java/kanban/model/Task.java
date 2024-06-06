package kanban.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private LocalDate creationDate;
    private String startDate;
    private String endDate;

    @PrePersist // Anotação para definir o valor antes de persistir no banco
    protected void onCreate() {
        creationDate = LocalDate.now();
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // Relacionamento com o usuário
}
