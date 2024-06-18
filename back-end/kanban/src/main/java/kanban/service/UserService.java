package kanban.service;

import kanban.exceptions.UserNotFoundException;
import kanban.model.User;
import kanban.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

import java.util.Optional;
import java.util.Set;

import jakarta.validation.Validator;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Validator validator;

    public User registerUser(User user) {
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Usuário já cadastrado");
        }

        return userRepository.save(user);
    }

    public User authenticateUser(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isEmpty()) {
            System.out.println("Usuário não encontrado: " + username);
            throw new UserNotFoundException("Usuário não encontrado");
        }

        User user = userOptional.get();

        if (user.getPassword().equals(password)) {
            return user;
        } else {
            throw new RuntimeException("Senha incorreta");
        }
    }
}
