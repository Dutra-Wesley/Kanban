package kanban.service;

import kanban.exceptions.UserNotFoundException;
import kanban.model.User;
import kanban.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Usuário já cadastrado");
        }
        return userRepository.save(user);
    }

    public User authenticateUser(String username, String password) {
        System.out.println("Tentando autenticar usuário: " + username);

        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isEmpty()) {
            System.out.println("Usuário não encontrado: " + username);
            throw new UserNotFoundException("Usuário não encontrado");
        }

        User user = userOptional.get();
        System.out.println("Comparando a senha: " + password + " com a senha do banco: " + user.getPassword());

        if (user.getPassword().equals(password)) {
            System.out.println("Usuário autenticado com sucesso: " + username);
            return user; // Retorna o usuário autenticado
        } else {
            System.out.println("Senha incorreta para o usuário: " + username);
            throw new RuntimeException("Senha incorreta");
        }
    }
}
