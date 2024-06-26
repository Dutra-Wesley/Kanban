package kanban.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import kanban.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    boolean existsByUsernameIgnoreCase(String username);
}
